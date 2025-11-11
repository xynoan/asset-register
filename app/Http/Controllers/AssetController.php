<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Models\Asset;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    /**
     * Display a listing of the assets.
     */
    public function index(Request $request)
    {
        $assets = Asset::with(['assignedEmployee', 'creator', 'updater'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Add document count to each asset
        $assets->getCollection()->transform(function ($asset) {
            $documentCount = 0;
            if ($asset->document_paths && is_array($asset->document_paths)) {
                $documentCount = count($asset->document_paths);
            }
            $asset->document_count = $documentCount;
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
            'document_paths' => !empty($documentPaths) ? $documentPaths : null,
            'assigned_to' => $assignedTo,
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);

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

        // Handle document uploads - merge with existing documents
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
            'document_paths' => !empty($documentPaths) ? $documentPaths : null,
            'assigned_to' => $assignedTo,
            'updated_by' => $userId,
        ];

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
}
