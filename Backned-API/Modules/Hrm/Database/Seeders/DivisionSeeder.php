<?php

namespace Modules\Hrm\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $designations = [
            [
                'name' => 'Sales Division',
                'code' => 'iv1',
            ],
            [
                'name' => 'Division 2',
                'code' => 'siv2',
            ],
        ];

        DB::table('divisions')->insert($designations);
    }
}
