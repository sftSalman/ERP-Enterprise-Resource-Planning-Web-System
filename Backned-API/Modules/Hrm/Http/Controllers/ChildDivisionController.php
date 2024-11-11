<?php

namespace Modules\Hrm\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Entities\DepartmentPermission;
use Modules\Hrm\Http\Requests\StoreChildDivisionRequest;
use Modules\Hrm\Http\Requests\UpdateChildDivisionRequest;
use Modules\Hrm\Repositories\ChildDivisionRepository;
use OpenApi\Annotations as OA;

class ChildDivisionController extends Controller
{
    public function __construct(
        private readonly ChildDivisionRepository $child_division,
        private readonly DepartmentPermission $permission
    )
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/child-divisions",
     *     tags={"ChildDivisions"},
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
                $this->child_division->getAll(request()->all()),
                __('Child Divisions fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/child-divisions",
     *     tags={"ChildDivisions"},
     *     summary="Create SubDivision",
     *     description="Create SubDivision",
     *     security={{"bearer":{}}},
     *     @OA\RequestBody(description="ChildDivisions objects", required=true,
     *         @OA\MediaType(mediaType="application/json",
     *            @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="name", description="SubDivision Name", type="string", example="IT"),
     *                 @OA\Property(property="code", description="SubDivision code", type="string", example="it"),
     *                 required={"name", "code"}
     *             )
     *         ),
     *     ),
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=400, description="Invalid input")
     * )
     */
    public function store(StoreChildDivisionRequest $request): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canCreateDepartment($request));

            return $this->responseSuccess(
                $this->child_division->create($request->all()),
                __('Child Division created successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/child-divisions/{id}",
     *     tags={"ChildDivisions"},
     *     summary="Get ChildDivisions detail",
     *     description="Get ChildDivisions detail",
     *     @OA\Parameter(name="id", in="path", description="ChildDivisions id", required=true,
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
                $this->child_division->getById($id),
                __('Child DIvision fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/child-divisions/{id}",
     *     tags={"ChildDivisions"},
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
    public function update(UpdateChildDivisionRequest $request, int $id): object
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canUpdateDepartment($request, $id));

            return $this->responseSuccess(
                $this->child_division->update($id, $request->except(['_method', 'id'])),
                __('Child Division updated successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/child-divisions/{id}",
     *     tags={"ChildDivisions"},
     *     summary="Delete SubDivision",
     *     description="Delete SubDivision",
     *     @OA\Parameter(name="id", in="path", description="Child DIvisions id", required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=404, description="SubDivision not found")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canDeleteDepartment($id));

            return $this->responseSuccess($this->child_division->delete($id),
                __('Child Division deleted successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/child-divisions/dropdown/list",
     *     tags={"ChildDivisions"},
     *     summary="Divisions dropdown list",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation")
     * )
     */
    public function dropdown(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->child_division->getDropdown(),
                __('Child Division dropdown fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
