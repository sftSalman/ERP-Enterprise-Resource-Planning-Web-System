<?php

namespace Modules\Hrm\Database\Seeders;

use App\Enum\Status;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Modules\Auth\Entities\Role;
use Modules\Hrm\Entities\Employee;

class EmployeeSeeder extends Seeder
{
    public function __construct() {}

    public function run(): void
    {
        $this->makeSuperAdminEmployee();
        $this->makeBankAdminEmployee();
        $this->makeBankAdminEmployee2();
        $this->makeBankAdminEmployee3();
        $this->makeBankAdminEmployee4();
        $this->makeBankAdminEmployee5();
        $this->makeBankAdminEmployee6();
        $this->makeBankAdminEmployee7();
        $this->makeBankAdminEmployee8();
        $this->makeBankAdminEmployee9();
        // $this->makeBankAssuranceAgent();
        // $this->makeSellerAgent();
    }

    private function makeSuperAdminEmployee(): void
    {
        $employee = Employee::updateOrCreate([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'code' => 'ATLI-101',
            'surname' => 'super_admin',
            'username' => 'super_admin',
            'phone' => '+8801840416210',
            'email_verified_at' => now(),
            'email' => 'admin@example.com',
            'password' => Hash::make('12345678'),
            'remember_token' => Str::random(10),
            "division_id" => null,
            "sub_division_id" => null,
            "child_division_id" => null,
            'created_by' => 1,
            'status' => Status::APPROVED,
        ]);

        if ($employee) {
            $employee->assignRole(Role::findByCode('super_admin'));
        }
    }

    private function makeBankAdminEmployee(): void
    {
        $employee = Employee::updateOrCreate(
            [
                'first_name' => 'Chief Sato',
                'last_name' => 'Yu',
                'code' => 'HRM-102',
                'surname' => '',
                'username' => 'admin1',
                'phone' => '+8801840416211',
                'email_verified_at' => now(),
                'email' => 'admin1@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => 1,
                "sub_division_id" => null,
                "child_division_id" => null,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }
    private function makeBankAdminEmployee2(): void
    {
        $employee = Employee::updateOrCreate(

            [
                'first_name' => 'Manager',
                'last_name' => ' (Concurrent) SA',
                'code' => 'HRM-103',
                'surname' => '',
                'username' => 'admin2',
                'phone' => '+8801840416212',
                'email_verified_at' => now(),
                'email' => 'admin2@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => null,
                "sub_division_id" => 1,
                "child_division_id" => null,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }
    private function makeBankAdminEmployee3(): void
    {
        $employee = Employee::updateOrCreate(


            [
                'first_name' => 'Manager',
                'last_name' => 'Hamai',
                'code' => 'HRM-104',
                'surname' => '',
                'username' => 'admin3',
                'phone' => '+8801840416213',
                'email_verified_at' => now(),
                'email' => 'admin3@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => null,
                "sub_division_id" => null,
                "child_division_id" => 1,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }
    private function makeBankAdminEmployee4(): void
    {
        $employee = Employee::updateOrCreate(


            [
                'first_name' => 'Chief Concurrent',
                'last_name' => 'Ha',
                'code' => 'HRM-105',
                'surname' => '',
                'username' => 'admin4',
                'phone' => '+8801840416214',
                'email_verified_at' => now(),
                'email' => 'admin4@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => null,
                "sub_division_id" => null,
                "child_division_id" => null,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }
    private function makeBankAdminEmployee5(): void
    {
        $employee = Employee::updateOrCreate(


            [
                'first_name' => 'Chief',
                'last_name' => 'Shimajiri',
                'code' => 'HRM-106',
                'surname' => '',
                'username' => 'admin5',
                'phone' => '+8801840416215',
                'email_verified_at' => now(),
                'email' => 'admin5@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => null,
                "sub_division_id" => null,
                "child_division_id" => null,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }

    private function makeBankAdminEmployee6(): void
    {
        $employee = Employee::updateOrCreate(


            [
                'first_name' => 'Division Manager',
                'last_name' => 'Concurrent',
                'code' => 'HRM-107',
                'surname' => '',
                'username' => 'admin7',
                'phone' => '+8801840416217',
                'email_verified_at' => now(),
                'email' => 'admin7@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => 2,
                "sub_division_id" => null,
                "child_division_id" => null,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }

    private function makeBankAdminEmployee7(): void
    {
        $employee = Employee::updateOrCreate(


            [
                'first_name' => 'Manager',
                'last_name' => 'Yamada',
                'code' => 'HRM-108',
                'surname' => '',
                'username' => 'admin8',
                'phone' => '+8801840416218',
                'email_verified_at' => now(),
                'email' => 'admin8@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => null,
                "sub_division_id" => null,
                "child_division_id" => 2,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }

    private function makeBankAdminEmployee8(): void
    {
        $employee = Employee::updateOrCreate(


            [
                'first_name' => 'Chief Hayashida',
                'last_name' => 'Koike',
                'code' => 'HRM-109',
                'surname' => '',
                'username' => 'admin9',
                'phone' => '+8801840416219',
                'email_verified_at' => now(),
                'email' => 'admin9@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => null,
                "sub_division_id" => null,
                "child_division_id" => null,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }

    private function makeBankAdminEmployee9(): void
    {
        $employee = Employee::updateOrCreate(


            [
                'first_name' => 'Chief Ito',
                'last_name' => 'Masuda',
                'code' => 'HRM-1010',
                'surname' => '',
                'username' => 'admin10',
                'phone' => '+88018404162110',
                'email_verified_at' => now(),
                'email' => 'admin10@example.com',
                'password' => Hash::make('12345678'),
                'remember_token' => Str::random(10),
                'designation_id' => 1,
                "division_id" => null,
                "sub_division_id" => null,
                "child_division_id" => null,
                'created_by' => 4,
                'is_head_office' => 0,
                'status' => Status::APPROVED,
            ],
        );

        if ($employee) {
            $employee->assignRole(Role::findByCode('bank_admin'));
        }
    }
}
