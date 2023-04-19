<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string|null  ...$guards
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */




    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                return redirect(RouteServiceProvider::HOME);
            }
        }

        return $next($request);
    }

    // public function handle(Request $request, Closure $next, ...$guards)
    // {
    //     $request->session()->regenerate();

    //     if (Auth::guard($guards)->check()) {
    //         // User is authenticated
    //         if (!$request->user()->hasVerifiedEmail()) {
    //             // Email not verified, redirect to verification page
    //             return redirect()->route('verification.notice');
    //         }

    //         // Email verified, redirect to user dashboard
    //         return redirect('/user/dashboard');
    //     }

    //     return $next($request);
    // }
}
