<?php

namespace Modules\Hrm\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubDivisionSeeder extends Seeder
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
                'name' => 'Solution Sales Department',
                'code' => 'sub div1',
                'division_id'=>1
            ],
            [
                'name' => 'Lesson 2',
                'code' => 'sub div2',
                'division_id'=>2
            ]
        ];

        DB::table('sub_divisions')->insert($designations);
    }
}
