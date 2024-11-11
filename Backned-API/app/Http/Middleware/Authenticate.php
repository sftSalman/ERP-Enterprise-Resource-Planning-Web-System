<?php

namespace App\Http\Middleware;

use App\Traits\ResponseTrait;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate extends Middleware
{
    use ResponseTrait;

    protected function redirectTo($request): ?JsonResponse
    {
        if (!$request->expectsJson()) {
            return $this->responseError(null, 'Unauthenticated access.');
        }
    }

    /**
     * Handle an unauthenticated employee.
     *
     * @param  Request  $request
     * @param  array  $guards
     * @return void
     */
    protected function unauthenticated($request, array $guards): void
    {
        throw new HttpResponseException(
            $this->responseError(null, 'Unauthenticated access.', Response::HTTP_UNAUTHORIZED)
        );
    }
}
