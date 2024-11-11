<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Entities\RolePermission;
use Modules\Auth\Http\Requests\RoleCreateRequest;
use Modules\Auth\Repositories\RoleRepository;
use OpenApi\Annotations as OA;

class RolesController extends Controller
{
    public function __construct(
        private readonly RoleRepository $role,
        private readonly RolePermission $permission
    )
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/roles",
     *     tags={"Role-Permissions"},
     *     summary="Get all roles",
     *     @OA\Parameter(name="perPage", in="query", description="Per page count", required=false, explode=true, @OA\Schema(default="10", type="integer")),
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="Successful data fetch"),
     *     @OA\Response(response=400, description="Invalid filter data"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canViewRoles());

            return $this->responseSuccess(
                $this->role->getAll(request()->all()),
                __('Roles has been fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/roles",
     *     tags={"Role-Permissions"},
     *     summary="Create new role with permissions",
     *     security={{"bearer":{}}},
     *     @OA\RequestBody(
     *         description="Role object",
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="role", type="string", example="Test Role 1"),
     *             @OA\Property(property="sum_assured_limit", type="integer", example=100000),
     *             @OA\Property(
     *                 property="groupList",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="name", type="string", example="Group 1"),
     *                     @OA\Property(property="isChecked", type="integer", example=1),
     *                     @OA\Property(
     *                         property="permissions",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="name", type="string", example="branch.view"),
     *                             @OA\Property(property="isChecked", type="integer", example=1)
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Successful role create"),
     *     @OA\Response(response=400, description="Invalid role data"),
     *     @OA\Response(response=403, description="Unauthorized to add role"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function store(RoleCreateRequest $request): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canCreateRole($request));

            return $this->responseSuccess(
                $this->role->create($request->all()),
                __('Role has been saved successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/roles/{id}",
     *     tags={"Role-Permissions"},
     *     summary="Show role",
     *     security={{"bearer":{}}},
     *     @OA\Parameter(name="id", description="Role ID", required=true, @OA\Schema(type="integer"), in="path", example=1),
     *     @OA\Response(response=200, description="Successful role find"),
     *     @OA\Response(response=403, description="Unauthorized to view role"),
     *     @OA\Response(response=404, description="role not found"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function show(int $id): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canViewRole($id));

            return $this->responseSuccess(
                $this->role->getById($id),
                __('Role has been fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/roles/{id}",
     *     tags={"Role-Permissions"},
     *     summary="Delete role",
     *     security={{"bearer":{}}},
     *     @OA\Parameter(name="id", description="Role ID", required=true, @OA\Schema(type="integer"), in="path", example=1),
     *     @OA\Response(response=200, description="Successful role delete"),
     *     @OA\Response(response=403, description="Unauthorized to delete role"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canDeleteRole($id));

            return $this->responseSuccess(
                $this->role->delete($id),
                __('Role has been deleted successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/roles/dropdown/list",
     *     tags={"Role-Permissions"},
     *     summary="Roles",
     *     description="Roles",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=401, description="Unauthennticated")
     * )
     */
    public function dropdown(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->role->getDropdown(),
                __('Roles dropdown list fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
