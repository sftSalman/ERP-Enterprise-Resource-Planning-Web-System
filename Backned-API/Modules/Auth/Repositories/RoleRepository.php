<?php

namespace Modules\Auth\Repositories;

use App\Abstracts\EntityRepository;
use App\Traits\SluggableTrait;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Auth\Entities\Role;
use Symfony\Component\HttpFoundation\Response;

class RoleRepository extends EntityRepository
{
    use SluggableTrait;

    public string $table = 'roles';

    public function __construct(private PermissionRepository $permission)
    {
    }

    /**
     * @throws Exception
     */
    public function getAll(array $filterData = []): Paginator
    {
        try {
            $filter = $this->getFilterData($filterData);
            $query = Role::with('permissions');

            if (isset($filter['search']) && strlen($filter['search']) > 0) {
                $query = $this->filterSearchQuery($query, $filter['search']);
            }

            return $query
                ->orderBy($filter['orderBy'], $filter['order'])
                ->paginate($filter['perPage']);
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    protected function getFilterData(array $filterData = []): array
    {
        $defaultArgs = [
            'perPage' => 10,
            'search' => '',
            'orderBy' => "{$this->table}.{$this->primaryKey}",
            'order' => 'asc'
        ];

        return array_merge($defaultArgs, $filterData);
    }

    protected function filterSearchQuery(Builder|EloquentBuilder $query, string $searchedText): Builder|EloquentBuilder
    {
        return $query->where('name', 'LIKE', "%$searchedText%");
    }

    /**
     * @throws Exception
     */
    public function getByColumn(string $columnName, $columnValue, array $selects = ['*']): ?object
    {
        try {
            if ($columnName === 'id') {
                $item = Role::findById($columnValue);
            } else {
                $item = Role::where($columnName, $columnValue)
                    ->with('permissions')
                    ->first();
            }

            $permissionGroups = $this->permission->getpermissionGroups();
            foreach ($permissionGroups as $key => $group) {
                $permissionGroups[$key]->name = Str::title(str_replace(".", " ", $permissionGroups[$key]->name));
                $data = $this->permission->getpermissionsByGroupName($group->name);
                foreach ($data as $key2 => $value) {
                    $data[$key2]->isChecked = $item->hasPermissionTo($data[$key2]->name);
                    $data[$key2]->printName = Str::title(str_replace(".", " ", $data[$key2]->name));
                }
                $permissionGroups[$key]->isChecked = false;
                $permissionGroups[$key]->permissions = $data;
            }

            if (empty($item)) {
                throw new Exception(
                    $this->getExceptionMessage(static::MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE),
                    Response::HTTP_NOT_FOUND
                );
            }

            $roleData = new \stdClass();
            $roleData->role = $item;
            $roleData->groups = $permissionGroups;

            return $roleData;
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function create(array $data): bool|object
    {
        $permissions = [];

        if (!$data['id']) {
            $role = Role::create([
                'name' => $data['role'],
                'guard_name' => 'api',
                'code' => $this->createUniqueSlug($data['role'], $this->table, 'code', '_'),
                'sum_assured_limit' => $data['sum_assured_limit'] ?? 0,
                'is_head_office' => $data['is_head_office'] ?? 1,
            ]);
        } else {
            $role = Role::findById((int)$data['id']);
        }

        // Create a role if that doesn't exist by name
        $groups = $data['groupList'] ?? [];

        if (isset($role->id)) {
            $role->name = $data['role'];
            $role->sum_assured_limit = $data['sum_assured_limit'] ?? 0;
            $role->is_head_office = $data['is_head_office'] ?? 1;
            $role->save();
        }

        foreach ($groups as $group) {
            foreach ($group['permissions'] as $permission) {
                if ($permission['isChecked']) {
                    array_push($permissions, $permission['name']);
                }
            }
        }

        $role->syncPermissions($permissions);

        return true;
    }

    /**
     * @throws Exception
     */
    public function delete(int $id): ?object
    {
        $role = $this->getById($id);

        //        if ($role && !$role->deletable) {
        //            throw new Exception(
        //                $this->getExceptionMessage(static::MESSAGE_ITEM_COULD_NOT_BE_DELETED),
        //                Response::HTTP_INTERNAL_SERVER_ERROR
        //            );
        //        }

        try {
            $deleted = $this->getQuery()
                ->where($this->primaryKey, $id)
                ->delete();
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        if (!$deleted) {
            throw new Exception(
                $this->getExceptionMessage(static::MESSAGE_ITEM_COULD_NOT_BE_DELETED),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return $role;
    }

    public function getRoleIdByEmployeeId(int $employeeId): ?int
    {
        return DB::table('model_has_roles')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->where('model_has_roles.model_type', 'Modules\Hrm\Entities\Employee')
            ->where('model_has_roles.model_id', $employeeId)
            ->value('roles.id');
    }

    protected function getDropdownSelectableColumns(): array
    {
        return [
            'name',
        ];
    }

    protected function getOrderByColumnWithOrders(): array
    {
        return [
            'id' => 'asc',
        ];
    }

    protected function getDropdownAdditionalWhere(Builder $query): Builder
    {
        $query->where('is_head_office', intval(request()->is_head_office));

        return $query;
    }

    protected function getExceptionMessages(): array
    {
        $exceptionMessages = parent::getExceptionMessages();

        $proposalExceptionMessages = [
            static::MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE => __('Role does not exist.'),
            static::MESSAGE_ITEM_COULD_NOT_BE_DELETED => __('Role could not be deleted.'),
        ];

        return array_merge($exceptionMessages, $proposalExceptionMessages);
    }
}
