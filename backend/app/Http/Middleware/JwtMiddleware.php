<?php

namespace App\Http\Middleware;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use Closure;
use Illuminate\Http\Request;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();
    } catch (JWTException $e) {
        if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
            return response()->json(['error' => 'Token is invalid'], 401);
        } elseif ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
            return response()->json(['error' => 'Token is expired'], 401);
        } else {
            return response()->json(['error' => 'Something is wrong'], 401);
        }
    }

    $response = $next($request);

    // Set CORS headers
    // $response->user = $user;
//     $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:4200');
// $response->headers->set('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
// $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');


    return $response;
}


}
