<?php

namespace Modules\Auth\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\ResetPasswordUserCheckRequest;
use Illuminate\Http\Request;
use Modules\Auth\Repositories\AuthRepository;
use OpenApi\Annotations as OA;

class ResetPasswordController extends Controller
{
    public function __construct(private AuthRepository $auth)
    {
        $this->auth = $auth;
    }


    /**
     * @OA\Post(
     *     path="/api/v1/user-check",
     *     tags={"Authentication"},
     *     summary="User Validity Check",
     *     description="User Validity Check",
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *            @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="user_address", description="Auth Phone No.", type="string", default="01324328709"),
     *                 required={"user_address"}
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Successfull Check"),
     *     @OA\Response(response=400, description="Invalid input"),
     *     @OA\Response(response=404, description="User not found"),
     *     @OA\Response(response=401, description="Invalid authentication")
     * )
     */
    public function checkUserValidity(ResetPasswordUserCheckRequest $request): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->auth->checkUserValidity($request->all()),
                __('User is valid')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/reset-password",
     *     tags={"Authentication"},
     *     summary="Password Reset",
     *     description="password Reset and login",
     *     @OA\RequestBody(required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *            @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="otp", description="Otp.", type="string", default="123456"),
     *                 @OA\Property(property="password", description="password.", type="string", default="123456"),
     *                 @OA\Property(property="email", description="email.", type="string", default="admin@example.com"),
     *                 required={"password"}
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Successfull login"),
     *     @OA\Response(response=400, description="Invalid input"),
     *     @OA\Response(response=404, description="User not found"),
     *     @OA\Response(response=401, description="Invalid authentication")
     * )
     */
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->auth->checkIfOtpIsValidOrNotAndLogin($request->all()),
                __('Logged in successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
