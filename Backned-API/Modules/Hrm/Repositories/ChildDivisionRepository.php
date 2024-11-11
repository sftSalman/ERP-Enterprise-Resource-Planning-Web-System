<?php

namespace Modules\Hrm\Repositories;

use App\Abstracts\EntityRepository;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Modules\Hrm\Entities\ChildDivision;
use Symfony\Component\HttpFoundation\Response;

class ChildDivisionRepository extends EntityRepository
{
    public string $table = ChildDivision::TABLE_NAME;
    public string $model='Modules\Hrm\Entities\ChildDivision';

    protected array $fillableColumns = [
        'name',
        'code',
        'sub_division_id',
        'created_at',
        'updated_at',
    ];

    private function getDesignationQuery(): Builder
    {
        return $this->getQuery()
            ->join('sub_divisions','child_divisions.sub_division_id','sub_divisions.id')
            ->select(
                'child_divisions.id',
                'child_divisions.name',
                'child_divisions.code',
                'sub_divisions.name as division_name',
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
        return $query->where('child_divisions.name', 'LIKE', $searchable)
            ->orWhere('child_divisions.code', 'LIKE', $searchable);
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
