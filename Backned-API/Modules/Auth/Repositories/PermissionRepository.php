<?php

namespace Modules\Auth\Repositories;

use App\Abstracts\EntityRepository;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class PermissionRepository extends EntityRepository
{
    public string $table = 'permissions';

    /**
     * @throws Exception
     */
    public function getAllPermissions(array $filterData = []): Collection
    {
        try {
            $permissionGroups = $this->getPermissionGroups();

            foreach ($permissionGroups as $key => $group) {
                $permissionGroups[$key]->name = Str::title(str_replace(".", " ", $permissionGroups[$key]->name));
                $data = $this->getPermissionsByGroupName($group->name);
                foreach ($data as $key2 => $value) {
                    $data[$key2]->isChecked = false;
                    $data[$key2]->printName = Str::title(str_replace(".", " ", $data[$key2]->name));
                }
                $permissionGroups[$key]->isChecked = false;
                $permissionGroups[$key]->permissions = $data;
            }

            return  $permissionGroups;
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getPermissionGroups(): Collection
    {
        return $this->getQuery()
            ->select('group_name as name')
            ->groupBy('group_name')
            ->get();
    }

    public function getPermissionsByGroupName($group_name): Collection
    {
        return $this->getQuery()
            ->select('name', 'id')
            ->where('group_name', $group_name)
            ->get();
    }

    public function roleHasPermissions($role, $permissions): bool
    {
        $hasPermission = true;
        foreach ($permissions as $permission) {
            if (!$role->hasPermissionTo($permission->name)) {
                $hasPermission = false;
                return $hasPermission;
            }
        }

        return $hasPermission;
    }
}
