<?php

namespace Tests\Unit;

use App\Traits\DateHelperTrait;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class DateHelperTest extends TestCase
{
    use DateHelperTrait;

    public function testCanCalculateAge(): void
    {
        $this->assertSame(
            20,
            $this->getAgeFromDate(Carbon::now()->sub('20 years 4 months'))
        );
        $this->assertSame(
            20,
            $this->getAgeFromDate(Carbon::now()->sub('20 years 6 months'))
        );
        $this->assertSame(
            21,
            $this->getAgeFromDate(Carbon::now()->sub('20 years 8 months'))
        );
    }
}
