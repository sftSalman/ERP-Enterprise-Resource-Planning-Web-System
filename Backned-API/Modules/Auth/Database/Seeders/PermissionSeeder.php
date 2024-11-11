<?php

namespace Modules\Auth\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Auth\Helpers\Permissions;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = Permissions::getAllPermissionsWithGrouping();

        for ($i = 0; $i < count($permissions); $i++) {
            $permissionGroup = $permissions[$i]['group_name'];

            for ($j = 0; $j < count($permissions[$i]['permissions']); $j++) {
                $permission = Permission::create([
                    'name' => $permissions[$i]['permissions'][$j],
                    'group_name' => $permissionGroup
                ]);
            }
        }
    }
}
