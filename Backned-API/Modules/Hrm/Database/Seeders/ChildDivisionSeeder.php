<?php

namespace Modules\Hrm\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChildDivisionSeeder extends Seeder
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
                'name' => 'Division 1',
                'code' => 'child div1',
                'sub_division_id'=>1
            ],
            [
                'name' => 'lesson 2',
                'code' => 'lesson 2',
                'sub_division_id'=>1
            ]
        ];

        DB::table('child_divisions')->insert($designations);
    }
}
