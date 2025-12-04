<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Asset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users (admin only).
     */
    public function index(): Response
    {
        $users = User::orderBy('created_at', 'desc')->get();
        
        if ($users->isEmpty()) {
            return Inertia::render('Users/Index', [
                'users' => $users,
            ]);
        }
        
        // Get all user IDs
        $userIds = $users->pluck('id')->toArray();
        
        // Get all assets that reference any of these users (single query)
        $assets = Asset::whereIn('created_by', $userIds)
            ->orWhereIn('updated_by', $userIds)
            ->get(['id', 'created_by', 'updated_by']);
        
        // Count unique assets per user in memory
        $userAssetCounts = [];
        foreach ($userIds as $userId) {
            $userAssetCounts[$userId] = $assets->filter(function ($asset) use ($userId) {
                return $asset->created_by == $userId || $asset->updated_by == $userId;
            })->unique('id')->count();
        }
        
        // Attach asset counts to users
        $users = $users->map(function ($user) use ($userAssetCounts) {
            $user->assets_count = $userAssetCounts[$user->id] ?? 0;
            return $user;
        });

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new user (admin only).
     */
    public function create(): Response
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created user (admin only).
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,user,encoder',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user (admin only).
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user (admin only).
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,user,encoder',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user (admin only).
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        // Check if user has any assets (created or updated)
        $assetsCount = Asset::where(function ($query) use ($user) {
            $query->where('created_by', $user->id)
                  ->orWhere('updated_by', $user->id);
        })->count();
        
        if ($assetsCount > 0) {
            return redirect()->route('users.index')
                ->with('error', 'Cannot delete user. This user has existing assets associated with them.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
