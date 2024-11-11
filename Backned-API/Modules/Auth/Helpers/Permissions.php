<?php

namespace Modules\Auth\Helpers;

use Illuminate\Support\Facades\DB;
use Modules\Auth\Entities\DashboardPermission;
use Modules\Auth\Entities\DepartmentPermission;
use Modules\Auth\Entities\DesignationPermission;
use Modules\Auth\Entities\EmployeePermission;
use Modules\Auth\Entities\ProfilePermission;
use Modules\Auth\Entities\RolePermission;
use Modules\Auth\Entities\OccupationPermission;

class Permissions
{
    public static function getAllPermissions(array $excludes = []): array
    {
        $groupPermissions = self::getAllPermissionsWithGrouping();
        $permissions = [];

        for ($i = 0; $i < count($groupPermissions); $i++) {
            $permissionGroup = $groupPermissions[$i]['group_name'];

            for ($j = 0; $j < count($groupPermissions[$i]['permissions']); $j++) {
                $permissionName = $groupPermissions[$i]['permissions'][$j];

                if (!in_array($permissionName, $excludes, true)) {
                    $permissions[] = $permissionName;
                }
            }
        }

        return $permissions;
    }

    public static function getAllPermissionsWithGrouping(): array
    {
        return [
            [
                'group_name' => 'dashboard',
                'permissions' => [
                    DashboardPermission::PERMISSION_VIEW,
                    DashboardPermission::PERMISSION_FINANCIAL_DASHBOARD,
                    DashboardPermission::PERMISSION_POLICY_DASHBOARD,
                ]
            ],
            [
                'group_name' => 'profile',
                'permissions' => [
                    ProfilePermission::PERMISSION_VIEW,
                    ProfilePermission::PERMISSION_EDIT,
                ],
            ],
            [
                'group_name' => 'employee',
                'permissions' => [
                    EmployeePermission::PERMISSION_CREATE,
                    EmployeePermission::PERMISSION_VIEW,
                    EmployeePermission::PERMISSION_EDIT,
                    EmployeePermission::PERMISSION_DELETE,
                    EmployeePermission::PERMISSION_APPROVE,
                ],
            ],
            [
                'group_name' => 'role',
                'permissions' => [
                    RolePermission::PERMISSION_CREATE,
                    RolePermission::PERMISSION_VIEW,
                    RolePermission::PERMISSION_EDIT,
                    RolePermission::PERMISSION_DELETE,
                    RolePermission::PERMISSION_SUPER_ADMIN,
                ],
            ],

            [
                'group_name' => 'designation',
                'permissions' => [
                    DesignationPermission::PERMISSION_CREATE,
                    DesignationPermission::PERMISSION_VIEW,
                    DesignationPermission::PERMISSION_EDIT,
                    DesignationPermission::PERMISSION_DELETE,
                ],
            ],

            [
                'group_name' => 'department',
                'permissions' => [
                    DepartmentPermission::PERMISSION_CREATE,
                    DepartmentPermission::PERMISSION_VIEW,
                    DepartmentPermission::PERMISSION_EDIT,
                    DepartmentPermission::PERMISSION_DELETE,
                    DepartmentPermission::PERMISSION_SUPER_ADMIN,
                ],
            ],
            [
                'group_name' => 'occupation',
                'permissions' => [
                    OccupationPermission::PERMISSION_VIEW,
                    OccupationPermission::PERMISSION_CREATE,
                    OccupationPermission::PERMISSION_EDIT,
                    OccupationPermission::PERMISSION_DELETE,
                    OccupationPermission::PERMISSION_SUPER_ADMIN,
                ],
            ],
        ];
    }

    public static function getAllPermissionsIncluding(array $includes = []): array
    {
        $groupPermissions = self::getAllPermissionsWithGrouping();
        $permissions = [];

        for ($i = 0; $i < count($groupPermissions); $i++) {
            $permissionGroup = $groupPermissions[$i]['group_name'];

            for ($j = 0; $j < count($groupPermissions[$i]['permissions']); $j++) {
                $permissionName = $groupPermissions[$i]['permissions'][$j];

                if (in_array($permissionName, $includes, true)) {
                    $permissions[] = $permissionName;
                }
            }
        }

        return $permissions;
    }

    public static function isSuperAdmin(): bool
    {
        if (app()->runningInConsole()) {
            return true;
        }

        if (empty(request()->user())) {
            return false;
        }

        return (bool)request()->user()->hasAnyPermission([
            RolePermission::PERMISSION_SUPER_ADMIN
        ]);
    }


}
