<?php

namespace Modules\Hrm\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentEmployeeSeeder extends Seeder
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
                'department_id' => 1,
                'employee_id' => 105,
            ],
            [
                'department_id' => 2,
                'employee_id' => 106,
            ],
            [
                'department_id' => 1,
                'employee_id' => 109,
            ],
            [
                'department_id' => 2,
                'employee_id' => 109,
            ],
            [
                'department_id' => 1,
                'employee_id' => 110,
            ],
            [
                'department_id' => 2,
                'employee_id' => 110,
            ],
        ];

        DB::table('employee_departments')->insert($designations);
    }
}
