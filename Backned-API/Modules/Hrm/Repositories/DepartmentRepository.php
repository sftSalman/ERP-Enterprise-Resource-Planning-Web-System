<?php

namespace Modules\Hrm\Repositories;

use App\Abstracts\EntityRepository;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Modules\Hrm\Entities\Department;
use Symfony\Component\HttpFoundation\Response;

class DepartmentRepository extends EntityRepository
{
    public string $table = Department::TABLE_NAME;
    public string $model='Modules\Hrm\Entities\Department';

    protected array $fillableColumns = [
        'name',
        'code',
        'child_division_id',
        'created_at',
        'updated_at',
    ];

    private function getDesignationQuery(): Builder
    {
        return $this->getQuery()
            ->join('child_divisions', 'departments.child_division_id', 'child_divisions.id')
            ->select(
                'departments.id',
                'departments.name',
                'departments.code',
                'child_divisions.name as child_division'
            );
    }

    public function getAll(array $filterData = []): Paginator
    {
        $filter = $this->getFilterData($filterData);

        $query = $this->getDesignationQuery();

        if (isset($filter['search']) && strlen($filter['search']) > 0) {
            $query = $this->filterSearchQuery($query, $filter['search']);
        }

        return $query->orderBy($filter['orderBy'], $filter['order'])
            ->paginate($filter['perPage']);
    }

    protected function filterSearchQuery(Builder|EloquentBuilder $query, string $searchedText): Builder
    {
        $searchable = "%$searchedText%";
        return $query->where('departments.name', 'LIKE', $searchable)
            ->orWhere('departments.code', 'LIKE', $searchable);
    }

    /**
     * @throws Exception
     */
    public function getByColumn(string $columnName, $columnValue, array $selects = ['*']): ?object
    {
        $item = $this->getDesignationQuery()
            ->where($columnName, $columnValue)
            ->first();

        if (empty($item)) {
            throw new Exception(
                $this->getExceptionMessage(static::MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE),
                Response::HTTP_NOT_FOUND
            );
        }

        return $item;
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

    public function getDepartmentByEmployeeId(int $employeeId): array
    {
        return $this->getQuery()->where('employee_id', $employeeId)
            ->select(['id', 'name'])
            ->pluck('id')
            ->toArray();
    }
}
