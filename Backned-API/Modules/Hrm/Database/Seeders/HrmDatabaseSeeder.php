<?php

namespace Modules\Hrm\Database\Seeders;

use Illuminate\Database\Seeder;

class HrmDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            DesignationSeeder::class,
            // DivisionSeeder::class,
            // SubDivisionSeeder::class,
            // ChildDivisionSeeder::class,
            // DepartmentSeeder::class,
            EmployeeSeeder::class,
            // DepartmentEmployeeSeeder::class,
        ]);
    }
}
