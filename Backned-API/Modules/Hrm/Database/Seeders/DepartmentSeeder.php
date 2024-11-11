<?php

namespace Modules\Hrm\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
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
                'name' => '1G',
                'code' => 'it',
                'child_division_id' =>1,
            ],
            [
                'name' => '2G',
                'code' => 'soft',
                'child_division_id' =>1,
            ],
            [
                'name' => '1G',
                'code' => 'it',
                'child_division_id' =>2,
            ],
            [
                'name' => '2G',
                'code' => 'soft',
                'child_division_id' =>2,
            ],
        ];

        DB::table('departments')->insert($designations);
    }
}
