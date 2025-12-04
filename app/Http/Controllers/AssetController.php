<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Models\Asset;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    /**
     * Display the dashboard with assets for quick comments.
     */
    public function dashboard(Request $request): Response
    {
        $assets = Asset::with(['assignedEmployee'])
            ->orderBy('created_at', 'desc')
            ->limit(20) // Show last 20 assets
            ->get();

        return Inertia::render('Dashboard', [
            'assets' => $assets,
        ]);
    }

    /**
     * Display a listing of the assets.
     */
    public function index(Request $request)
    {
        $assets = Asset::with(['assignedEmployee', 'creator', 'updater'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Add document count and status duration to each asset
        $assets->getCollection()->transform(function ($asset) {
            $documentCount = 0;
            if ($asset->document_paths && is_array($asset->document_paths)) {
                $documentCount = count($asset->document_paths);
            }
            $asset->document_count = $documentCount;
            $asset->status_duration_days = $asset->getStatusDurationDays();
            $asset->status_duration_string = $asset->getStatusDurationString();
            return $asset;
        });

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'data' => $assets,
                'message' => 'Assets retrieved successfully'
            ]);
        }

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
        ]);
    }

    /**
     * Show the form for creating a new asset.
     */
    public function create(): Response
    {
        $employees = Employee::where('status', 'active')
            ->orderBy('full_name')
            ->get(['id', 'employee_no', 'full_name']);

        return Inertia::render('Assets/Create', [
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created asset in storage.
     */
    public function store(StoreAssetRequest $request)
    {
        $validated = $request->validated();

        $assetId = $this->generateAssetId();

        $userId = Auth::id() ?? $this->getDefaultUserId();

        // Convert empty string to null for assigned_to
        $assignedTo = !empty($validated['assigned_to']) ? (int) $validated['assigned_to'] : null;

        // Handle document uploads - store both path and original filename
        $documentPaths = [];
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('assets/documents', 'public');
                $documentPaths[] = [
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName()
                ];
            }
        }

        $asset = Asset::create([
            'asset_id' => $assetId,
            'asset_category' => $validated['asset_category'],
            'brand_manufacturer' => $validated['brand_manufacturer'],
            'model_number' => $validated['model_number'],
            'serial_number' => $validated['serial_number'],
            'purchase_date' => $validated['purchase_date'],
            'vendor_supplier' => !empty($validated['vendor_supplier']) ? $validated['vendor_supplier'] : null,
            'warranty_expiry_date' => !empty($validated['warranty_expiry_date']) ? $validated['warranty_expiry_date'] : null,
            'status' => $validated['status'],
            'maintenance_history' => !empty($validated['maintenance_history']) ? $validated['maintenance_history'] : null,
            'comments_history' => !empty($validated['comments_history']) ? $validated['comments_history'] : null,
            'notes' => !empty($validated['notes']) ? $validated['notes'] : null,
            'document_paths' => !empty($documentPaths) ? $documentPaths : null,
            'assigned_to' => $assignedTo,
            'created_by' => $userId,
            'updated_by' => $userId,
            'status_changed_at' => now(),
        ]);

        // Record initial status in status history
        $asset->recordStatusChange($validated['status'], $userId);

        // Record initial assignment if assigned
        if ($assignedTo) {
            $asset->recordAssignmentChange($assignedTo, $userId, $validated['status']);
            $asset->save();
        }

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Asset created successfully!',
                'data' => $asset->load(['assignedEmployee', 'creator', 'updater'])
            ], 201);
        }

        return redirect()->route('assets.index')
            ->with('success', 'Asset created successfully!');
    }

    /**
     * Display the specified asset.
     */
    public function show(Request $request, Asset $asset)
    {
        $asset->load(['assignedEmployee', 'creator', 'updater']);

        // Add status duration
        $asset->status_duration_days = $asset->getStatusDurationDays();
        $asset->status_duration_string = $asset->getStatusDurationString();

        // Process maintenance_history to resolve performed_by employee IDs to full names
        if ($asset->maintenance_history) {
            // Handle both array and JSON string formats
            $maintenanceHistory = $asset->maintenance_history;
            if (is_string($maintenanceHistory)) {
                $maintenanceHistory = json_decode($maintenanceHistory, true);
            }
            
            if (is_array($maintenanceHistory)) {
                foreach ($maintenanceHistory as &$entry) {
                    if (isset($entry['performed_by']) && is_numeric($entry['performed_by'])) {
                        $employee = Employee::find($entry['performed_by']);
                        $entry['performed_by'] = $employee ? $employee->full_name : 'N/A';
                    }
                }
                $asset->maintenance_history = $maintenanceHistory;
            }
        }

        // Process assignment_history to ensure user names are resolved (already stored in model, but ensure consistency)
        if ($asset->assignment_history) {
            // Handle both array and JSON string formats
            $assignmentHistory = $asset->assignment_history;
            if (is_string($assignmentHistory)) {
                $assignmentHistory = json_decode($assignmentHistory, true);
            }
            
            if (is_array($assignmentHistory)) {
                foreach ($assignmentHistory as &$entry) {
                    // Resolve assigned_by user ID to name if not already set
                    if (isset($entry['assigned_by_id']) && is_numeric($entry['assigned_by_id']) && !isset($entry['assigned_by'])) {
                        $user = User::find($entry['assigned_by_id']);
                        $entry['assigned_by'] = $user ? $user->name : 'System';
                    }
                }
                $asset->assignment_history = $assignmentHistory;
            }
        }

        // Convert document paths to URLs for frontend access
        // Also normalize document structure for backward compatibility
        if ($asset->document_paths && is_array($asset->document_paths)) {
            $normalizedDocuments = array_map(function($doc) {
                // Handle backward compatibility: if it's a string (old format), convert to new format
                if (is_string($doc)) {
                    return [
                        'path' => $doc,
                        'original_name' => basename($doc) // Fallback to filename from path
                    ];
                }
                // Already in new format
                return $doc;
            }, $asset->document_paths);
            
            $asset->document_paths = $normalizedDocuments;
            $asset->document_urls = array_map(function ($doc) {
                $path = is_array($doc) ? $doc['path'] : $doc;
                return Storage::url($path);
            }, $normalizedDocuments);
        } else {
            $asset->document_paths = [];
            $asset->document_urls = [];
        }

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'data' => $asset,
                'message' => 'Asset retrieved successfully'
            ]);
        }

        return Inertia::render('Assets/Show', [
            'asset' => $asset,
        ]);
    }

    /**
     * Show the form for editing the specified asset.
     */
    public function edit(Asset $asset): Response
    {
        $employees = Employee::where('status', 'active')
            ->orderBy('full_name')
            ->get(['id', 'employee_no', 'full_name']);

        return Inertia::render('Assets/Edit', [
            'asset' => $asset,
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified asset in storage.
     */
    public function update(UpdateAssetRequest $request, Asset $asset)
    {
        $validated = $request->validated();

        $userId = Auth::id() ?? $this->getDefaultUserId();

        // Convert empty string to null for assigned_to
        $assignedTo = !empty($validated['assigned_to']) ? (int) $validated['assigned_to'] : null;

        // Handle document removal - delete files from storage
        $removedDocuments = $request->input('removed_documents', []);
        if (!empty($removedDocuments) && is_array($removedDocuments)) {
            foreach ($removedDocuments as $docIndex) {
                if (isset($asset->document_paths[$docIndex])) {
                    $doc = $asset->document_paths[$docIndex];
                    $docPath = is_array($doc) ? $doc['path'] : $doc;
                    if (Storage::disk('public')->exists($docPath)) {
                        Storage::disk('public')->delete($docPath);
                    }
                }
            }
        }

        // Handle document uploads - merge with existing documents (excluding removed ones)
        // Normalize existing documents to ensure they have the new structure
        $documentPaths = $asset->document_paths ?? [];
        if (!empty($documentPaths)) {
            $documentPaths = array_map(function($doc) {
                // Handle backward compatibility: if it's a string (old format), convert to new format
                if (is_string($doc)) {
                    return [
                        'path' => $doc,
                        'original_name' => basename($doc) // Fallback to filename from path
                    ];
                }
                // Already in new format
                return $doc;
            }, $documentPaths);

            // Remove documents that were marked for deletion
            if (!empty($removedDocuments)) {
                foreach ($removedDocuments as $docIndex) {
                    unset($documentPaths[$docIndex]);
                }
                $documentPaths = array_values($documentPaths); // Re-index array
            }
        }
        
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('assets/documents', 'public');
                $documentPaths[] = [
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName()
                ];
            }
        }

        // Check if status changed and record it
        $oldStatus = $asset->status;
        $newStatus = $validated['status'];
        
        // Record status change if status was modified (before update so it's included in the update)
        if ($oldStatus !== $newStatus) {
            $asset->recordStatusChange($newStatus, $userId);
        }

        // Check if assignment changed and record it
        $oldAssignedTo = $asset->assigned_to;
        
        // Record assignment change if assignment was modified (before update so it's included in the update)
        if ($oldAssignedTo != $assignedTo) {
            $asset->recordAssignmentChange($assignedTo, $userId, $newStatus);
        }
        
        // Track field changes for modification history
        $changes = [];
        $fieldsToTrack = [
            'asset_category',
            'brand_manufacturer',
            'model_number',
            'serial_number',
            'purchase_date',
            'vendor_supplier',
            'warranty_expiry_date',
            'status',
            'assigned_to',
        ];

        foreach ($fieldsToTrack as $field) {
            $oldValue = $asset->getOriginal($field);
            $newValue = null;

            if ($field === 'assigned_to') {
                $newValue = $assignedTo;
                // Format employee info for display
                if ($oldValue) {
                    $oldEmployee = Employee::find($oldValue);
                    $oldValue = $oldEmployee ? $oldEmployee->employee_no : $oldValue;
                }
                if ($newValue) {
                    $newEmployee = Employee::find($newValue);
                    $newValue = $newEmployee ? $newEmployee->employee_no : $newValue;
                }
            } elseif ($field === 'purchase_date' || $field === 'warranty_expiry_date') {
                $newValue = !empty($validated[$field]) ? $validated[$field] : null;
                // Format dates for display
                if ($oldValue) {
                    $oldValue = is_string($oldValue) ? $oldValue : $oldValue->format('Y-m-d');
                }
                if ($newValue) {
                    $newValue = is_string($newValue) ? $newValue : (is_object($newValue) ? $newValue->format('Y-m-d') : $newValue);
                }
            } else {
                $newValue = isset($validated[$field]) ? $validated[$field] : null;
            }

            // Normalize null/empty values for comparison
            $oldValueNormalized = $oldValue === null || $oldValue === '' ? null : $oldValue;
            $newValueNormalized = $newValue === null || $newValue === '' ? null : $newValue;

            if ($oldValueNormalized != $newValueNormalized) {
                $changes[] = [
                    'field' => $field,
                    'old_value' => $oldValueNormalized,
                    'new_value' => $newValueNormalized,
                ];
            }
        }

        // Track document changes
        $oldDocCount = is_array($asset->document_paths) ? count($asset->document_paths) : 0;
        $newDocCount = is_array($documentPaths) ? count($documentPaths) : 0;
        if ($oldDocCount != $newDocCount) {
            $changes[] = [
                'field' => 'documents',
                'old_value' => $oldDocCount . ' document(s)',
                'new_value' => $newDocCount . ' document(s)',
            ];
        }
        
        $updateData = [
            'asset_category' => $validated['asset_category'],
            'brand_manufacturer' => $validated['brand_manufacturer'],
            'model_number' => $validated['model_number'],
            'serial_number' => $validated['serial_number'],
            'purchase_date' => $validated['purchase_date'],
            'vendor_supplier' => !empty($validated['vendor_supplier']) ? $validated['vendor_supplier'] : null,
            'warranty_expiry_date' => !empty($validated['warranty_expiry_date']) ? $validated['warranty_expiry_date'] : null,
            'status' => $validated['status'],
            'maintenance_history' => !empty($validated['maintenance_history']) ? $validated['maintenance_history'] : null,
            'comments_history' => !empty($validated['comments_history']) ? $validated['comments_history'] : null,
            'notes' => !empty($validated['notes']) ? $validated['notes'] : null,
            'document_paths' => !empty($documentPaths) ? $documentPaths : null,
            'assigned_to' => $assignedTo,
            'updated_by' => $userId,
        ];

        // Include status_history and status_changed_at if status changed
        if ($oldStatus !== $newStatus) {
            $updateData['status_history'] = $asset->status_history;
            $updateData['status_changed_at'] = $asset->status_changed_at;
        }

        // Include assignment_history if assignment changed
        if ($oldAssignedTo != $assignedTo) {
            $updateData['assignment_history'] = $asset->assignment_history;
        }

        // Record modification history if there are changes
        if (!empty($changes)) {
            $modificationHistory = $asset->modification_history ?? [];
            $user = Auth::user();
            $modifiedByName = $user ? $user->name : 'System';
            
            $modificationHistory[] = [
                'timestamp' => now()->toDateTimeString(),
                'date' => now()->format('Y-m-d'),
                'modified_by_id' => $userId,
                'modified_by' => $modifiedByName,
                'changes' => $changes,
            ];
            
            $updateData['modification_history'] = $modificationHistory;
        }

        $asset->update($updateData);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Asset updated successfully!',
                'data' => $asset->load(['assignedEmployee', 'creator', 'updater'])
            ]);
        }

        return redirect()->route('assets.show', $asset)
            ->with('success', 'Asset updated successfully!');
    }

    /**
     * Remove the specified asset from storage (soft delete).
     */
    public function destroy(Request $request, Asset $asset)
    {
        // Block encoders from deleting assets
        if ($request->user() && $request->user()->isEncoder()) {
            abort(403, 'Unauthorized. Encoders are not allowed to delete assets.');
        }

        $asset->delete(); // This will set deleted_at timestamp

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Asset deleted successfully!'
            ]);
        }

        return redirect()->route('assets.index')
            ->with('success', 'Asset deleted successfully!');
    }

    /**
     * Restore a soft-deleted asset.
     */
    public function restore(Request $request, $id)
    {
        $asset = Asset::withTrashed()->findOrFail($id);
        $asset->restore();

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Asset restored successfully!'
            ]);
        }

        return redirect()->route('assets.index')
            ->with('success', 'Asset restored successfully!');
    }

    /**
     * Generate a unique asset ID in format A#00001, A#00002, etc.
     */
    private function generateAssetId(): string
    {
        $prefix = 'A#';
        
        // Get all assets (including soft-deleted) with the prefix and extract their sequence numbers
        // We need withTrashed because the unique constraint on asset_id includes deleted records
        $assets = Asset::withTrashed()
            ->where('asset_id', 'like', $prefix . '%')
            ->pluck('asset_id')
            ->toArray();

        $maxSequence = 0;
        foreach ($assets as $assetId) {
            if (preg_match('/A#(\d+)/', $assetId, $matches)) {
                $sequence = (int) $matches[1];
                if ($sequence > $maxSequence) {
                    $maxSequence = $sequence;
                }
            }
        }

        $newSequence = $maxSequence + 1;
        
        // Double-check uniqueness in case of race condition
        $attempts = 0;
        do {
            $newAssetId = $prefix . str_pad($newSequence, 5, '0', STR_PAD_LEFT);
            $exists = Asset::withTrashed()->where('asset_id', $newAssetId)->exists();
            if ($exists) {
                $newSequence++;
                $attempts++;
            } else {
                break;
            }
            
            // Safety check to prevent infinite loop
            if ($attempts > 1000) {
                throw new \Exception('Unable to generate unique asset ID after 1000 attempts');
            }
        } while ($exists);

        return $newAssetId;
    }

    /**
     * Get the default user ID, creating a system user if none exists.
     */
    private function getDefaultUserId(): int
    {
        // Try to get the first user
        $user = User::first();
        
        if ($user) {
            return $user->id;
        }

        // If no user exists, create or get a default system user
        $systemUser = User::firstOrCreate(
            ['email' => 'system@asset-register.local'],
            [
                'name' => 'System',
                'password' => bcrypt(uniqid()), // Random password since it won't be used
            ]
        );

        return $systemUser->id;
    }

    /**
     * Add a comment to an asset from the dashboard.
     */
    public function addComment(Request $request, Asset $asset)
    {
        $request->validate([
            'comment' => ['required', 'string', 'max:1000']
        ]);

        $userId = Auth::id() ?? $this->getDefaultUserId();
        $user = Auth::user();
        $addedBy = $user ? $user->name : 'System';

        // Get existing comments or initialize array
        // Ensure it's always an array, even if cast fails or returns a string
        $commentsHistory = $asset->comments_history;
        if (!is_array($commentsHistory)) {
            // If it's a string, try to decode it, otherwise use empty array
            if (is_string($commentsHistory) && !empty($commentsHistory)) {
                $decoded = json_decode($commentsHistory, true);
                $commentsHistory = is_array($decoded) ? $decoded : [];
            } else {
                $commentsHistory = [];
            }
        }

        // Add new comment with auto-populated values
        $commentsHistory[] = [
            'date' => now()->format('Y-m-d'),
            'comment' => $request->comment,
            'added_by' => $addedBy,
            'added_at' => now()->toDateTimeString(),
        ];

        $asset->update([
            'comments_history' => $commentsHistory,
            'updated_by' => $userId,
        ]);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Comment added successfully!',
                'data' => $asset->load(['assignedEmployee', 'creator', 'updater'])
            ]);
        }

        return redirect()->back()
            ->with('success', 'Comment added successfully!');
    }
}
