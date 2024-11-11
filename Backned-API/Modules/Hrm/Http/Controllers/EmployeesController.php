<?php

namespace Modules\Hrm\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\RequestSanitizerTrait;
use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Entities\EmployeePermission;
use Modules\Hrm\Http\Requests\EmployeeStoreRequest;
use Modules\Hrm\Http\Requests\EmployeeUpdateRequest;
use Modules\Hrm\Repositories\EmployeeRepository;
use OpenApi\Annotations as OA;

class EmployeesController extends Controller
{
    use RequestSanitizerTrait;

    public function __construct(
        private EmployeeRepository $employee,
        private EmployeePermission $permission
    )
    {
        $this->employee = $employee;
        $this->permission = $permission;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/employees",
     *     tags={"Employees"},
     *     summary="Get all employees for REST API",
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
            $this->permission->checkAuthResponse($this->permission->canViewEmployees());

            return $this->responseSuccess(
                $this->employee->getAll(request()->all()),
                __('Employee has been fetched successfully.')
            );
        } catch (Exception $e) {
            return $this->responseError([], $e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/employees",
     *     tags={"Employees"},
     *     summary="Create new employee",
     *     security={{"bearer":{}}},
     *     @OA\RequestBody(
     *         description="Employee object",
     *         required=true,
     *         @OA\MediaType(
     *            mediaType="application/json",
     *            @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="first_name",description="First Name",type="string",default="Jhon"),
     *                 @OA\Property(property="last_name",description="Last Name",type="string",default="Deo"),
     *                 @OA\Property(property="email",description="Email",type="string",default="example@gmail.com"),
     *                 @OA\Property(property="password",description="Password",type="string",default="12345678"),
     *                 @OA\Property(property="designation_id",description="Designation",type="integer",default=1),
     *                 @OA\Property(property="role_id",description="Role ID",type="integer",default=1),
     *                 @OA\Property(property="phone",description="Phone",type="string",default="123244444"),
     *                 @OA\Property(property="avatar",description="Avatar",type="string",format="binary"),
     *                 required={"first_name", "last_name", "email", "phone", "password", "designation_id", "role_id"}
     *             )
     *         ),
     *     ),
     *     @OA\Response(response=200, description="Successful employee create"),
     *     @OA\Response(response=400, description="Invalid employee data"),
     *     @OA\Response(response=403, description="Unauthorized to add employee"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function store(EmployeeStoreRequest $request)
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canCreateEmployee($request));

            return $this->responseSuccess(
                $this->employee->create($request->all()),
                __('Employee has been created successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/employees/{id}",
     *     tags={"Employees"},
     *     summary="Show employee",
     *     security={{"bearer":{}}},
     *     @OA\Parameter(name="id", description="Employee ID", required=true, @OA\Schema(type="integer"), in="path", example=1),
     *     @OA\Response(response=200, description="Successful Employee find"),
     *     @OA\Response(response=403, description="Unauthorized to delete Employee"),
     *     @OA\Response(response=404, description="Employee not found"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function show(int $id): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canViewEmployee((int)$id));

            return $this->responseSuccess(
                $this->employee->getById($id),
                __('Employee has been fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/employees/{id}",
     *     tags={"Employees"},
     *     summary="Update employee",
     *     security={{"bearer":{}}},
     *     @OA\Parameter(name="id", description="Employee ID", required=true, @OA\Schema(type="integer"), in="path", example=1),
     *     @OA\Parameter(name="_method", description="Method", required=true, @OA\Schema(type="string", default="PUT"), in="query"),
     *     @OA\RequestBody(
     *         description="Employee object",
     *         required=true,
     *         @OA\MediaType(
     *            mediaType="application/json",
     *            @OA\Schema(
     *                  type="object",
     *                 @OA\Property(property="id",description="ID",type="integer",default="5"),
     *                 @OA\Property(property="first_name",description="First Name",type="string",default="Jhon"),
     *                 @OA\Property(property="last_name",description="Last Name",type="string",default="Deo"),
     *                 @OA\Property(property="email",description="Email",type="string",default="example@gmail.com"),
     *                 @OA\Property(property="designation_id",description="Designation",type="integer",default=1),
     *                 @OA\Property(property="role_id",description="Role ID",type="integer",default=1),
     *                 @OA\Property(property="phone",description="Phone",type="string",default="123244444"),
     *                 @OA\Property(property="avatar",description="Avatar",type="string",format="binary"),
     *                 required={"first_name", "last_name", "email", "designation_id", "phone"}
     *             )
     *         ),
     *     ),
     *     @OA\Response(response=200, description="Successful employee update"),
     *     @OA\Response(response=400, description="Invalid employee data"),
     *     @OA\Response(response=405, description="Method not allowed"),
     *     @OA\Response(response=403, description="Unauthorized to update employee"),
     *     @OA\Response(response=404, description="Employee not found"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function update(EmployeeUpdateRequest $request, int $id)
    {
        try {
            $id = intval($request->id);
            $this->permission->checkAuthResponse($this->permission->canUpdateEmployee($request, $id));

            $sucessMessage = (int)$request->user()->id === $id ? __('Your profile updated successfully.') :
                __('Employee has been updated successfully.');

            return $this->responseSuccess(
                $this->employee->update($id, $this->getUpdateRequest($request)),
                $sucessMessage
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode(), $exception->getCode());
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/employees/{id}",
     *     tags={"Employees"},
     *     summary="Delete Employee",
     *     security={{"bearer":{}}},
     *     @OA\Parameter(name="id", description="Employee ID", required=true, @OA\Schema(type="integer"), in="path", example=1),
     *     @OA\Response(response=200, description="Successful employee delete"),
     *     @OA\Response(response=403, description="Unauthorized to delete employee"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canDeleteEmployee($id));

            return $this->responseSuccess(
                $this->employee->delete($id),
                __('Employee has been deleted successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode(), $exception->getCode());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/employees/dropdown/list",
     *     tags={"Employees"},
     *     summary="Employees dropdown list",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation")
     * )
     */
    public function dropdown(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->employee->getDropdown(),
                __('Employees dropdown fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }


        /**
     * @OA\Get(
     *     path="/api/v1/employees/chart",
     *     tags={"Employees"},
     *     summary="Get chart employees for REST API",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="Successful data fetch"),
     *     @OA\Response(response=400, description="Invalid filter data"),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function chart(): JsonResponse
    {
        try {
            $this->permission->checkAuthResponse($this->permission->canViewEmployees());

            return $this->responseSuccess(
                $this->employee->getChart(),
                __('Employee has been fetched successfully.')
            );
        } catch (Exception $e) {
            return $this->responseError([], $e->getMessage());
        }
    }
}
