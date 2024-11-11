<?php

namespace Modules\Auth\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Modules\Auth\Repositories\AuthRepository;
use OpenApi\Annotations as OA;

class ProfileController extends Controller
{
    public function __construct(private AuthRepository $auth)
    {
        $this->auth = $auth;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/profile",
     *     tags={"Authentication"},
     *     summary="Auth profile",
     *     description="Auth profile",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=401, description="Unauthennticated")
     * )
     */
    public function show(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->auth->getAuthUserProfileData(),
                __('Fetched logged in user profile data.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
