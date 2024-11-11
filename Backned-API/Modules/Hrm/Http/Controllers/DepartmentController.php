<?php

namespace Modules\Hrm\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Entities\ActivityLog;
use Modules\Auth\Entities\DepartmentPermission;
use Modules\Auth\Repositories\ActivityLogReporsitory;
use Modules\Hrm\Http\Requests\StoreDepartmentRequest;
use Modules\Hrm\Http\Requests\StoreDesignationRequest;
use Modules\Hrm\Http\Requests\UpdateDepartmentRequest;
use Modules\Hrm\Http\Requests\UpdateDesignationRequest;
use Modules\Hrm\Repositories\DepartmentRepository;
use OpenApi\Annotations as OA;

class DepartmentController extends Controller
{
    public function __construct(
        private readonly DepartmentRepository $department,
        private readonly DepartmentPermission $permission,
        private readonly ActivityLogReporsitory $log
    )
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/departments",
     *     tags={"Departments"},
     *     summary="Get all departments for REST API",
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
                $this->department->getAll(request()->all()),
                __('Departments fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/departments",
     *     tags={"Departments"},
     *     summary="Create Department",
     *     description="Create Department",
     *     security={{"bearer":{}}},
     *     @OA\RequestBody(description="Departments objects", required=true,
     *         @OA\MediaType(mediaType="application/json",
     *            @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="name", description="Departments Name", type="string", example="IT"),
     *                 @OA\Property(property="code", description="Departments code", type="string", example="it"),
     *                 required={"name", "code"}
     *             )
     *         ),
     *     ),
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=400, description="Invalid input")
     * )
     */
    public function store(StoreDepartmentRequest $request)
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canCreateDepartment($request));
            $data=$this->responseSuccess(
                $this->department->create($request->all()),
                __('Department created successfully.'),
                
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/departments/{id}",
     *     tags={"Departments"},
     *     summary="Get departments detail",
     *     description="Get departments detail",
     *     @OA\Parameter(name="id", in="path", description="Departments id", required=true,
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
                $this->department->getById($id),
                __('Department fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/departments/{id}",
     *     tags={"Departments"},
     *     summary="Update Department",
     *     description="Update Department",
     *     security={{"bearer":{}}},
     *     @OA\Parameter(name="id", in="path", description="Department id", required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(name="_method", in="query", description="request method", required=true,
     *         @OA\Schema(type="string", default="PUT")
     *     ),
     *     @OA\RequestBody(
     *         description="Department objects",
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="id", description="Department id", type="integer", example="1"),
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
    public function update(UpdateDepartmentRequest $request, int $id): object
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canUpdateDepartment($request, $id));

            return $this->responseSuccess(
                $this->department->update($id, $request->except(['_method', 'id'])),
                __('Department updated successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/departments/{id}",
     *     tags={"Departments"},
     *     summary="Delete Department",
     *     description="Delete Department",
     *     @OA\Parameter(name="id", in="path", description="Department id", required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=404, description="Department not found")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canDeleteDepartment($id));

            return $this->responseSuccess($this->department->delete($id),
                __('Department deleted successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/departments/dropdown/list",
     *     tags={"Departments"},
     *     summary="Departments dropdown list",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation")
     * )
     */
    public function dropdown(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->department->getDropdown(),
                __('Department dropdown fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
