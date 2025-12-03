<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BlockUserModifications
{
    /**
     * Handle an incoming request.
     * Block users with role 'user' from modifying assets (create, edit, update, delete).
     * Only admins and encoders can modify assets.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->isUser()) {
            abort(403, 'Unauthorized. Users can only view assets.');
        }

        return $next($request);
    }
}

