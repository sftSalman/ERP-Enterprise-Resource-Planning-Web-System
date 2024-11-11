<?php

namespace Modules\Hrm\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Entities\DesignationPermission;
use Modules\Hrm\Http\Requests\StoreDesignationRequest;
use Modules\Hrm\Http\Requests\UpdateDesignationRequest;
use Modules\Hrm\Repositories\DesignationRepository;
use OpenApi\Annotations as OA;

class DesignationController extends Controller
{
    public function __construct(
        private readonly DesignationRepository $designation,
        private readonly DesignationPermission $permission
    )
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/designations",
     *     tags={"Designations"},
     *     summary="Get all designations for REST API",
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
            $this->permission->checkAuthResponse($this->permission->canViewDesignations());

            return $this->responseSuccess(
                $this->designation->getAll(request()->all()),
                __('Designations fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/designations",
     *     tags={"Designations"},
     *     summary="Create Designation",
     *     description="Create Designation",
     *     security={{"bearer":{}}},
     *     @OA\RequestBody(description="Designations objects", required=true,
     *         @OA\MediaType(mediaType="application/json",
     *            @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="name", description="Designations Name", type="string", example="GM"),
     *                 @OA\Property(property="code", description="Designations code", type="string", example="gm"),
     *                 required={"name", "code"}
     *             )
     *         ),
     *     ),
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=400, description="Invalid input")
     * )
     */
    public function store(StoreDesignationRequest $request): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canCreateDesignation($request));

            return $this->responseSuccess(
                $this->designation->create($request->all()),
                __('Designation created successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/designations/{id}",
     *     tags={"Designations"},
     *     summary="Get designations detail",
     *     description="Get designations detail",
     *     @OA\Parameter(name="id", in="path", description="Designations id", required=true,
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
            $this->permission->checkAuthResponse($this->permission->canViewDesignation($id));

            return $this->responseSuccess(
                $this->designation->getById($id),
                __('Designation fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/designations/{id}",
     *     tags={"Designations"},
     *     summary="Update Designations",
     *     description="Update Designations",
     *     security={{"bearer":{}}},
     *     @OA\Parameter(name="id", in="path", description="Designations id", required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(name="_method", in="query", description="request method", required=true,
     *         @OA\Schema(type="string", default="PUT")
     *     ),
     *     @OA\RequestBody(
     *         description="Designations objects",
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="id", description="Designations id", type="integer", example="1"),
     *                 @OA\Property(property="name", description="Designations Name", type="string", example="GM"),
     *                 @OA\Property(property="code", description="Designations code", type="string", example="gm"),
     *                 required={"name", "code"}
     *             )
     *         ),
     *     ),
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=400, description="Invalid input")
     * )
     */
    public function update(UpdateDesignationRequest $request, int $id): object
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canUpdateDesignation($request, $id));

            return $this->responseSuccess(
                $this->designation->update($id, $request->except(['_method', 'id'])),
                __('Designation updated successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/designations/{id}",
     *     tags={"Designations"},
     *     summary="Delete Designation",
     *     description="Delete Designation",
     *     @OA\Parameter(name="id", in="path", description="Designations id", required=true,
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
            $this->permission->checkAuthResponse($this->permission->canDeleteDesignation($id));

            return $this->responseSuccess($this->designation->delete($id),
                __('Designation deleted successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/designations/dropdown/list",
     *     tags={"Designations"},
     *     summary="Designation dropdown list",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation")
     * )
     */
    public function dropdown(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->designation->getDropdown(),
                __('Designation dropdown fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
