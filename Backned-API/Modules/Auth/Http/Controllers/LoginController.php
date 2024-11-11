<?php

namespace Modules\Auth\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use Modules\Auth\Repositories\AuthRepository;
use OpenApi\Annotations as OA;

class LoginController extends Controller
{
    public function __construct(private AuthRepository $auth)
    {
        $this->auth = $auth;
    }

    /**
     * @OA\Post(
     *     path="/api/v1/login",
     *     tags={"Authentication"},
     *     summary="Login",
     *     description="Login to system.",
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *            @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="email", description="Auth Email", type="string", default="admin@example.com"),
     *                 @OA\Property(property="password", description="Auth password", type="string", default="12345678"),
     *                 required={"email", "password"}
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Successfull login"),
     *     @OA\Response(response=400, description="Invalid input"),
     *     @OA\Response(response=404, description="User not found"),
     *     @OA\Response(response=401, description="Invalid authentication")
     * )
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->auth->login($request->all()),
                __('Logged in successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
