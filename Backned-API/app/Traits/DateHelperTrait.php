<?php

namespace App\Traits;

use Carbon\Carbon;

trait DateHelperTrait
{
    public function getAgeFromDate(?string $date): int
    {
        if (empty($date)) {
            return 0;
        }

        $dateOfBirth = Carbon::parse($date);
        $currentDate = Carbon::now();

        return (int) $dateOfBirth->diffInYears($currentDate);
    }
}
