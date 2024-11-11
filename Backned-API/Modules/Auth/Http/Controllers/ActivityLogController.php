<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\RequestSanitizerTrait;
use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Entities\EmployeePermission;
use Modules\Auth\Repositories\ActivityLogRepository;
use OpenApi\Annotations as OA;

class ActivityLogController extends Controller
{
    use RequestSanitizerTrait;

    public function __construct(
        private ActivityLogRepository $employee,
        private EmployeePermission $permission
    )
    {
        $this->employee = $employee;
        $this->permission = $permission;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/activity-log",
     *     tags={"Activity Log"},
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
                $this->employee->getAllLogs(request()->all()),
                __('Logs has been fetched successfully.')
            );
        } catch (Exception $e) {
            return $this->responseError([], $e->getMessage());
        }
    }
}
