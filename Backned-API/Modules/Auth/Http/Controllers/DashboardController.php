<?php

namespace Modules\Auth\Http\Controllers;
use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Modules\Auth\Repositories\DashboardReporsitory;
use OpenApi\Annotations as OA;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardReporsitory $dashboard)
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/dashboard/counting",
     *     tags={"Dashboard"},
     *     summary="Get all dashboard for REST API",
     *     description="Dashboard Count Api fetch",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation"),
     *     @OA\Response(response=400, description="Invalid status value")
     * )
     */
    public function getDashboardCounting(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->dashboard->getCounting(),
                __('Dashboard Counting fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage(), $exception->getCode());
        }
    }
}
