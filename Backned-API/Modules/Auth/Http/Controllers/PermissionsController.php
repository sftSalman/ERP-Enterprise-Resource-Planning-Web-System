<?php

namespace Modules\Auth\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Modules\Auth\Repositories\PermissionRepository;
use OpenApi\Annotations as OA;

class PermissionsController extends Controller
{
    public function __construct(private readonly PermissionRepository $permission) {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/roles/permissions",
     *     tags={"Role-Permissions"},
     *     summary="Get all permissions",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="Successful data fetch"),
     *     @OA\Response(response=400, description="Invalid filter data"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function index(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->permission->getAllPermissions(request()->all()),
                __('Permissions has been fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
