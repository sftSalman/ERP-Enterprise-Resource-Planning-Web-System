<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Modules\Auth\Repositories\MenuGeneratorRepository;
use OpenApi\Annotations as OA;

class MenuController extends Controller
{
    public function __construct(
        private readonly MenuGeneratorRepository $menuGenerator,
    )
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/menu",
     *     tags={"Master Data"},
     *     summary="Get all menus of a user",
     *     security={{"bearer":{}}},
     *     @OA\Response(response=200, description="successful operation",),
     *     @OA\Response(response=500, description="Internal server error")
     * )
     */
    public function index(): JsonResponse
    {
        try {
            return $this->responseSuccess(
                $this->menuGenerator->generate()->get(),
                __('Menus fetched successfully.')
            );
        } catch (Exception $exception) {
            return $this->responseError([], $exception->getMessage());
        }
    }
}
