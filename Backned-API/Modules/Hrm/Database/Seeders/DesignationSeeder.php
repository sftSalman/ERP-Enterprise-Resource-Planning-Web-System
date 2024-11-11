<?php

namespace Modules\Hrm\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DesignationSeeder extends Seeder
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
                'name' => 'Main Admin',
                'code' => 'TA',
            ],
            [
                'name' => 'Chief Executive Officer',
                'code' => 'CEO',
            ],
            [
                'name' => 'General Manager',
                'code' => 'GM'
            ],
            [
                'name' => 'Product Manager',
                'code' => 'PM'
            ],
            [
                'name' => 'Executive Officer',
                'code' => 'EO'
            ],
        ];

        DB::table('designations')->insert($designations);
    }
}
