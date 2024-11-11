<?php

namespace Modules\Auth\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Modules\Auth\Repositories\AuthRepository;
use OpenApi\Annotations as OA;

class LogoutController extends Controller
{
    public function __construct(private AuthRepository $auth)
    {
        $this->auth = $auth;
    }

    /**
     * @OA\Post(
     *     path="/api/v1/logout",
     *     tags={"Authentication"},
     *     summary="Auth logout",
     *     description="Auth logout",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function logout(): JsonResponse
    {
        try {
            $this->auth->logoutUserData();
            return $this->responseSuccess('', __('Authenticated user logged out successfully.'));
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage());
        }
    }
}
