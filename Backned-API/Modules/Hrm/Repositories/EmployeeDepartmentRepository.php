<?php

namespace Modules\Hrm\Repositories;

use App\Abstracts\EntityRepository;
use Modules\Hrm\Entities\EmployeeBranch;
use Modules\Hrm\Entities\EmployeeDepartment;

class EmployeeDepartmentRepository extends EntityRepository
{
    public string $table = EmployeeDepartment::TABLE_NAME;

    protected array $fillableColumns = [
        'employee_id',
        'department_id',
        'created_at',
        'updated_at',
    ];

    public function __construct(private readonly DepartmentRepository $department)
    {
        //
    }

    public function bulkInsert(int $employeeId, array $departmentIds): bool
    {
        $employeeDepartments = [];

        // Delete previous departments of this employee
        $this->getQuery()->where('employee_id', $employeeId)->delete();

        // if (count($departmentIds) === 0) {
        //     $departmentIds = $this->department->getDepartmentByEmployeeId($employeeId);
        // }

        if (count($departmentIds) > 0) {
            foreach ($departmentIds as $department) {
                $employeeDepartments[] = [
                    'employee_id' => $employeeId,
                    'department_id' => (int)$department['value'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        return $this->getQuery()->insert($employeeDepartments);
    }

    public function getDepartmentIdsByEmployeeId(int $employeeId): array
    {
        return array_unique(array_column($this->getDepartmentsByEmployeeId($employeeId), 'branch_id'));
    }

    public function getDepartmentsByEmployeeId(int $employeeId): array
    {
        return $this->getQuery()
            ->where('employee_id', $employeeId)
            ->select([
                'employee_departments.id',
                'employee_departments.department_id',
                'departments.name as department_name',
            ])
            ->join('departments', 'departments.id', '=', 'employee_departments.department_id')
            ->get()
            ->toArray();
    }
}
