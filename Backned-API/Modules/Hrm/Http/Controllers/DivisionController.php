<?php

namespace Modules\Hrm\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Entities\DepartmentPermission;
use Modules\Hrm\Http\Requests\StoreDivisionRequest;
use Modules\Hrm\Http\Requests\UpdateDivisionRequest;
use Modules\Hrm\Repositories\DivisionRepository;
use OpenApi\Annotations as OA;

class DivisionController extends Controller
{
    public function __construct(
        private readonly DivisionRepository $division,
        private readonly DepartmentPermission $permission
    )
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/divisions",
     *     tags={"Divisions"},
     *     summary="Get all divisions for REST API",
     *     description="Multiple status values can be provided with comma separated string",
     *     @OA\Parameter(name="perPage", in="query", description="Per page count", required=false, explode=true,
     *         @OA\Schema(default="10", type="integer")
     *     ),
     *     @OA\Parameter(name="search", in="query", description="Search by title", required=false, explode=true,
     *         @OA\Schema(default="", type="string")
     *     ),
     *     @OA\Parameter(name="orderBy", in="query", description="Order By column name", required=false, explode=true,
     *         @OA\Schema(default="id", type="string")
     *     ),
     *     @OA\Parameter(name="order", in="query", description="Order ordering - asc or desc", required=false, explode=true,
     *         @OA\Schema(default="desc", type="string")
     *     ),
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=400, description="Invalid status value")
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canViewDepartments());

            return $this->responseSuccess(
                $this->division->getAll(request()->all()),
                __('Divisions fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/divisions",
     *     tags={"Divisions"},
     *     summary="Create Division",
     *     description="Create Division",
     *     security={{"bearer":{}}},
     *     @OA\RequestBody(description="Divisions objects", required=true,
     *         @OA\MediaType(mediaType="application/json",
     *            @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="name", description="Division Name", type="string", example="IT"),
     *                 @OA\Property(property="code", description="Division code", type="string", example="it"),
     *                 required={"name", "code"}
     *             )
     *         ),
     *     ),
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=400, description="Invalid input")
     * )
     */
    public function store(StoreDivisionRequest $request): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canCreateDepartment($request));

            return $this->responseSuccess(
                $this->division->create($request->all()),
                __('Division created successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

   /**
     * @OA\Get(
     *     path="/api/v1/divisions/{id}",
     *     tags={"Divisions"},
     *     summary="Get divisions detail",
     *     description="Get divisions detail",
     *     @OA\Parameter(name="id", in="path", description="Division id", required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=404, description="Project not found")
     * )
     */
    public function show(int $id): object
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canViewDepartment($id));

            return $this->responseSuccess(
                $this->division->getById($id),
                __('Division fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/divisions/{id}",
     *     tags={"Divisions"},
     *     summary="Update Division",
     *     description="Update Division",
     *     security={{"bearer":{}}},
     *     @OA\Parameter(name="id", in="path", description="Division id", required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(name="_method", in="query", description="request method", required=true,
     *         @OA\Schema(type="string", default="PUT")
     *     ),
     *     @OA\RequestBody(
     *         description="Division objects",
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="id", description="DIvision id", type="integer", example="1"),
     *                 @OA\Property(property="name", description="Deaprtment Name", type="string", example="GM"),
     *                 @OA\Property(property="code", description="Deaprtment code", type="string", example="gm"),
     *                 required={"name", "code"}
     *             )
     *         ),
     *     ),
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=400, description="Invalid input")
     * )
     */
    public function update(UpdateDivisionRequest $request, int $id): object
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canUpdateDepartment($request, $id));

            return $this->responseSuccess(
                $this->division->update($id, $request->except(['_method', 'id'])),
                __('Division updated successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/divisions/{id}",
     *     tags={"Divisions"},
     *     summary="Delete Designation",
     *     description="Delete Designation",
     *     @OA\Parameter(name="id", in="path", description="DIvisions id", required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=404, description="Designation not found")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canDeleteDepartment($id));

            return $this->responseSuccess($this->division->delete($id),
                __('Division deleted successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/divisions/dropdown/list",
     *     tags={"Divisions"},
     *     summary="Divisions dropdown list",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation")
     * )
     */
    public function dropdown(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->division->getDropdown(),
                __('DIvision dropdown fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
