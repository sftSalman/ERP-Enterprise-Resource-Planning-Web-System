<?php

namespace Modules\Hrm\Repositories;

use App\Abstracts\EntityRepository;
use App\Entity\FilePath;
use App\Enum\Status;
use App\Helpers\Base64Encoder;
use App\Helpers\ImageUploadHelper;
use App\Traits\FileUploaderTrait;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Modules\Auth\Helpers\Permissions;
use Modules\Auth\Repositories\RoleRepository;
use Modules\Hrm\Entities\Division;
use Modules\Hrm\Entities\Employee;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;

class EmployeeRepository extends EntityRepository
{
    use FileUploaderTrait;

    public string $table = Employee::TABLE_NAME;
    public string $model='Modules\Hrm\Entities\Employee';

    protected bool $isHeadOffice = true;

    protected array $fillableColumns = [
        'first_name',
        'last_name',
        'code',
        'email',
        'password',
        'designation_id',
        "division_id",
        "sub_division_id",
        "child_division_id",
        "department_id",
        'level',
        'phone',
        'avatar',
        'created_at',
        'updated_at',
    ];

    public function __construct(
        private readonly RoleRepository                 $role,
        private readonly DepartmentRepository           $department,
        private readonly EmployeeDepartmentRepository   $employeeDepartment,
    ) {}

    protected function getQuery(): Builder
    {
        return $this->checkPermittedEmployees(parent::getQuery());
    }

    public function getAll(array $filterData = []): Paginator
    {
        $filter = $this->getFilterData($filterData);
        $query = $this->getEmployeeQuery()
            ->where("$this->table.$this->primaryKey", '<>', $this->getCurrentUserId());

        if (!$filter['with_deleted']) {
            $query->whereNull('deleted_at');
        }

        if (isset($filter['search']) && strlen($filter['search']) > 0) {
            $query = $this->filterSearchQuery($query, $filter['search']);
        }

        return $query
            ->orderBy($filter['orderBy'], $filter['order'])
            ->paginate($filter['perPage']);
    }

    public function getChart()
    {
        $divisions = Division::with([
            'employees',
            'subdivisions.employees',
            'subdivisions.childDivisions.employees',
            'subdivisions.childDivisions.departments.employees'
        ])->get();

        return $divisions;
    }

    protected function getFilterData(array $filterData = []): array
    {
        $defaultArgs = [
            'perPage' => 10,
            'search' => '',
            'orderBy' => 'id',
            'order' => 'desc',
            'with_deleted' => false,
        ];

        return array_merge($defaultArgs, $filterData);
    }

    private function getEmployeeQuery(): Builder
    {
        return $this->getQuery()
            ->select(
                'employees.id',
                'employees.first_name',
                'employees.last_name',
                'employees.code',
                'employees.email',
                'employees.designation_id',
                'employees.division_id',
                'employees.sub_division_id',
                'employees.child_division_id',
                'employees.level',
                'designations.name as designation_name',
                'employees.phone',
                'employees.avatar',
                'employees.status',
                'employees.created_at',
                'roles.name as role_name',
            )
            ->leftjoin('employee_departments', 'employee_departments.employee_id', '=', 'employees.id')
            ->leftjoin(
                'designations',
                'designations.id',
                '=',
                'employees.designation_id'
            )
            ->leftjoin('model_has_roles', 'employees.id', '=', 'model_has_roles.model_id')
            ->leftjoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->groupBy('employees.id');
    }


    protected function filterSearchQuery(Builder|EloquentBuilder $query, string $searchedText): Builder
    {
        $searchable = "%$searchedText%";
        return $query->where('employees.first_name', 'LIKE', $searchable)
            ->orWhere('employees.last_name', 'LIKE', $searchable)
            ->orWhere('employees.code', 'LIKE', $searchable)
            ->orWhere('employees.email', 'LIKE', $searchable)
            ->orWhere('designations.name', 'LIKE', $searchable)
            ->orWhere('employees.phone', 'LIKE', $searchable)
            ->orWhere('employees.status', 'LIKE', $searchable);
    }


    /**
     * @throws Exception
     */
    public function getByColumn(string $columnName, $columnValue, array $selects = ['*']): ?object
    {
        $employee = $this->getEmployeeQuery()
            ->where($columnName, $columnValue)
            ->first();

        if (empty($employee)) {
            throw new Exception(
                $this->getExceptionMessage(static::MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE),
                Response::HTTP_NOT_FOUND
            );
        }

        // Get the project id from branches.
        $departments = $this->employeeDepartment->getDepartmentsByEmployeeId($employee->id);


        $employee->departments = $departments;
        $employee->department_ids = array_column($departments, 'id');
        $employee->role_id = $this->role->getRoleIdByEmployeeId($employee->id);

        return $employee;
    }

    public function getCount(array $filterData = []): int
    {
        $filter = $this->getFilterData($filterData);

        $query = $this->getQuery();

        if (!$filter['with_deleted']) {
            $query->whereNull('deleted_at');
        }

        return $query->count();
    }

    /**
     * @throws Exception
     */
    public function create(array $data): bool|int
    {
        try {
            DB::beginTransaction();
            $roleId = (int)$data['role_id'];
            $departmentIds = (array)$data['department_ids'] ?? [];
            $password = isset($data['password']) ? $data['password'] : 'admin@$@123';
            $data = $this->prepareForDB($data);
            $employeeId = $this->getQuery()->insertGetId($data);

            $employee = Employee::find($employeeId);
            $employee->assignRole(Role::findById($roleId));
            $bulkInserted = $this->employeeDepartment->bulkInsert($employeeId, $departmentIds);
            // $employee->assignRole(Role::findById($roleId));
            activity()
            ->causedBy(auth()->user())
            ->performedOn($employee)
            ->withProperties($data)
            ->log('logged in');
            
            DB::commit();
            return $employeeId ?? false;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @throws Exception
     */
    public function prepareForDB(array $data, ?object $item = null): array
    {
        $data = parent::prepareForDB($data, $item);

        if (empty($item)) {
            $data['created_at'] = now();
            $data['created_by'] = $this->getCurrentUserId();
            $data['status'] = Status::APPROVED;
            if (!empty($data['avatar'])) {
                $image = Base64Encoder::uploadBase64AsImage($data['avatar'], FilePath::PATH_EMPLOYEE_AVATAR, 'employee-' . time() . '-' . uniqid(), 'image');
                $data['avatar'] = $image;
            }
            $data['code'] = 'HRM' . '-' . $this->getNextAutoIncrementId();
        } else {
            $data['updated_by'] = $this->getCurrentUserId();
            $data['updated_at'] = now();

            if (!empty($data['avatar'])) {
                if (!is_null($item->avatar)) {
                    $this->deleteFile(FilePath::PATH_EMPLOYEE_AVATAR, $item->avatar);
                }
                // $data['avatar'] = $this->uploadFile($data['avatar'], FilePath::PATH_EMPLOYEE_AVATAR, $data['first_name']);
                // $image = Base64Encoder::updateBase64File($data['avatar'], FilePath::PATH_EMPLOYEE_AVATAR, $item->avatar, 'employee');
                $image = Base64Encoder::uploadBase64AsImage($data['avatar'], FilePath::PATH_EMPLOYEE_AVATAR, 'employee-' . time() . '-' . uniqid(), 'image');
                $data['avatar'] = $image;
            } else {
                $data['avatar'] = $item->avatar;
            }
        }
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        return $data;
    }

    /**
     * @throws Exception
     */
    public function update(int $id, array $data): ?object
    {
        try {
            DB::beginTransaction();
            $roleId = isset($data['role_id']) ? (int)$data['role_id'] : 0;
            $departmentIds = (array)$data['department_ids'] ?? [];

            $employee = Employee::find($id);
            $data = $this->prepareForDB($data, $employee);
            // $this->update($id, $data);
            $this->getQuery()
                ->where("{$this->table}.{$this->primaryKey}", $id)
                ->update($data);

            if ($this->getCurrentUserId() !== $id) {
                $this->employeeDepartment->bulkInsert($id, $departmentIds);

                if ($roleId) {
                    $employee->assignRole(Role::findById($roleId));
                }
            }
            activity()
            ->causedBy(auth()->user())
            ->performedOn($employee)
            ->withProperties($data)
            ->log('Employee Updated');

            DB::commit();
            return $this->getById($id);
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @throws Exception
     */
    public function getDropdown(): array
    {
        $dropdowns = parent::getDropdown();
        $dropdownsData = [];
        foreach ($dropdowns as $dropdownItem) {
            $dropdownItem->name = $dropdownItem->first_name . ' ' . $dropdownItem->last_name . ' #' . $dropdownItem->id;
            unset($dropdownItem->first_name, $dropdownItem->last_name, $dropdownItem->phone);
            $dropdownsData[] = $dropdownItem;
        }

        return $dropdownsData;
    }

    protected function getExceptionMessages(): array
    {
        $exceptionMessages = parent::getExceptionMessages();

        $employeeExceptionMessages = [
            static::MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE => __(
                'Employee does not exist.'
            ),
            static::MESSAGE_ITEM_COULD_NOT_BE_DELETED => __(
                'Employee could not be deleted.'
            ),
        ];

        return array_merge($exceptionMessages, $employeeExceptionMessages);
    }

    protected function getDropdownSelectableColumns(): array
    {
        return [
            'first_name',
            'last_name',
        ];
    }

    protected function getOrderByColumnWithOrders(): array
    {
        return [
            'first_name' => 'asc',
        ];
    }

    private function checkPermittedEmployees(Builder $query): Builder
    {
        if (Permissions::isSuperAdmin()) {
            return $query;
        }

        return $query->whereIn('employees.id', Permissions::getEmployeeIdsByParentEmployeeId());
    }
}
