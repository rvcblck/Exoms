<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (! $response instanceof \Symfony\Component\HttpFoundation\BinaryFileResponse &&
            ! $response->isRedirection() &&
            $response->isSuccessful()) {
            $response->header('Access-Control-Allow-Origin', '*')
                     ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
                     ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
        }

        return $response;
    }
}
