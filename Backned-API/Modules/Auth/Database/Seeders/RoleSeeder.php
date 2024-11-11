<?php

namespace Modules\Auth\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'ADMIN',
                'code' => 'super_admin',
                'deletable' => 0,
                'guard_name' => 'api',
                'sum_assured_limit' => 99999999,
                'is_head_office' => 1,
            ],
            [
                'name' => 'ADMIN (Bank)',
                'code' => 'bank_admin',
                'deletable' => 0,
                'guard_name' => 'api',
                'sum_assured_limit' => 1500000,
                'is_head_office' => 0,
            ],
            [
                'name' => 'Bank Assurance Manager',
                'code' => 'bank_assurance_manager',
                'deletable' => 0,
                'guard_name' => 'api',
                'sum_assured_limit' => 0,
                'is_head_office' => 0,
            ],
            [
                'name' => 'Bank Corporate Executive',
                'code' => 'bank_executive',
                'deletable' => 0,
                'guard_name' => 'api',
                'sum_assured_limit' => 0,
                'is_head_office' => 0,
            ],
            [
                'name' => 'Introducer/Seller',
                'code' => 'seller',
                'deletable' => 0,
                'guard_name' => 'api',
                'sum_assured_limit' => 0,
                'is_head_office' => 0,
            ],
            [
                'name' => 'UND Officer',
                'code' => 'und_officer',
                'deletable' => 1,
                'guard_name' => 'api',
                'sum_assured_limit' => 1000000,
                'is_head_office' => 1,
            ],
            [
                'name' => 'Data Entry',
                'code' => 'data_entry',
                'deletable' => 1,
                'guard_name' => 'api',
                'sum_assured_limit' => 0,
                'is_head_office' => 1,
            ],
            [
                'name' => 'Proposer',
                'code' => 'proposer',
                'deletable' => 1,
                'guard_name' => 'api',
                'sum_assured_limit' => 0,
                'is_head_office' => 0,
            ],
        ];

        Role::insert($roles);
    }
}
