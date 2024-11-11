<?php

namespace App\Http\Controllers;

use App\Traits\ResponseTrait;
use OpenApi\Annotations as OA;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Hr Admin REST API",
 *      description="L5 Swagger OpenApi description",
 *      @OA\Contact(
 *          email="abir.ahmad007@gmail.com"
 *      ),
 *     @OA\License(
 *         name="Apache 2.0",
 *         url="https://www.apache.org/licenses/LICENSE-2.0.html"
 *     )
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, ResponseTrait;

    
}
