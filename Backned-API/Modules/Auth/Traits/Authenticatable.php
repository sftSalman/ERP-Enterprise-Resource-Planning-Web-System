<?php

namespace Modules\Auth\Traits;

use Exception;

trait Authenticatable
{
    /**
     * @throws Exception
     */
    public function getCurrentUserId(): int
    {
        if (app()->runningInConsole()) {
            return 1;
        }

        if (!isset(request()->user()->id)) {
            throw new Exception(__('You are not authenticated to view this.'));
        }

        return (int) request()->user()->id;
    }
}
