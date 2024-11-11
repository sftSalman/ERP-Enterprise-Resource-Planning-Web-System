<?php

namespace Modules\Hrm\Repositories;

use App\Abstracts\EntityRepository;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Modules\Hrm\Entities\SubDivision;
use Symfony\Component\HttpFoundation\Response;

class SubDivisionRepository extends EntityRepository
{
    public string $table = SubDivision::TABLE_NAME;

    protected array $fillableColumns = [
        'name',
        'code',
        'division_id',
        'created_at',
        'updated_at',
    ];
    public string $model='Modules\Hrm\Entities\SubDivision';
    private function getDesignationQuery(): Builder
    {
        return $this->getQuery()
            ->leftjoin('divisions','sub_divisions.division_id','divisions.id')
            ->select(
                'sub_divisions.id',
                'sub_divisions.name',
                'sub_divisions.code',
                'divisions.name as division_name',
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
        return $query->where('sub_divisions.name', 'LIKE', $searchable)
            ->orWhere('sub_divisions.code', 'LIKE', $searchable);
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
