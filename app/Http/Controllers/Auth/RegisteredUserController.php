<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     * Only accessible to admins.
     */
    public function create(): Response
    {
        // Registration is now handled by UserController for admins
        // This route should redirect to user management
        if (Auth::check() && Auth::user()->isAdmin()) {
            return redirect()->route('users.create');
        }

        abort(403, 'Only administrators can register new users.');
    }

    /**
     * Handle an incoming registration request.
     * This method is now disabled - registration is handled by UserController.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        abort(403, 'Public registration is disabled. Only administrators can create new users.');
    }
}
