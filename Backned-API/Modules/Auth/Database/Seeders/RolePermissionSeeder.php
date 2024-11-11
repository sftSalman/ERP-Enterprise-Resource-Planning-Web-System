<?php

namespace Modules\Auth\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Auth\Entities\DashboardPermission;
use Modules\Auth\Entities\ProfilePermission;
use Modules\Auth\Entities\Role;
use Modules\Auth\Helpers\Permissions;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $this->assignSuperAdminPermissions(); // main admin
        $this->assignBankAdminPermission(); // bank manager admin
        $this->assignBankAssuranceManagerPermissions(); // bank assurance officer
        $this->assignBankCorporateExecutivePermissions(); // corporate executive
        $this->assignUndOfficerPermission();
        $this->assignDataEntryPermission();
    }

    private function assignSuperAdminPermissions(): void
    {
        $this->assignRolePermission('super_admin', Permissions::getAllPermissions([]));
    }

    private function assignRolePermission(string $roleCode, array $permissions = []): void
    {
        $role = Role::findByCode($roleCode);
        $role->givePermissionTo($permissions);

        foreach ($permissions as $permission) {
            (Permission::findByName($permission))->assignRole($role);
        }
    }

    private function assignBankAdminPermission(): void
    {
        $this->assignRolePermission(
            'bank_admin',
            Permissions::getAllPermissionsIncluding([
                DashboardPermission::PERMISSION_VIEW,
                DashboardPermission::PERMISSION_FINANCIAL_DASHBOARD,
                DashboardPermission::PERMISSION_POLICY_DASHBOARD,

                ProfilePermission::PERMISSION_VIEW,
                ProfilePermission::PERMISSION_EDIT,
            ])
        );
    }

    private function assignBankAssuranceManagerPermissions(): void
    {
        $this->assignRolePermission(
            'bank_assurance_manager',
            Permissions::getAllPermissionsIncluding([
                DashboardPermission::PERMISSION_VIEW,

                ProfilePermission::PERMISSION_VIEW,
                ProfilePermission::PERMISSION_EDIT,
            ])
        );
    }

    private function assignBankCorporateExecutivePermissions(): void
    {
        $this->assignRolePermission(
            'bank_executive',
            Permissions::getAllPermissionsIncluding([])
        );
    }

    private function assignUndOfficerPermission(): void
    {
        $this->assignRolePermission(
            'und_officer',
            Permissions::getAllPermissionsIncluding([
                DashboardPermission::PERMISSION_VIEW,

                ProfilePermission::PERMISSION_VIEW,
                ProfilePermission::PERMISSION_EDIT,
            ])
        );
    }

    private function assignDataEntryPermission(): void
    {
        $this->assignRolePermission(
            'data_entry',
            Permissions::getAllPermissionsIncluding([])
        );
    }
}
