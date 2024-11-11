<?php

namespace App\Abstracts;

use App\Entity\Dropdown;
use App\Interfaces\CrudInterface;
use App\Interfaces\DBPreparableInterface;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use Modules\Auth\Traits\Authenticatable;
use Symfony\Component\HttpFoundation\Response;

abstract class EntityRepository implements CrudInterface, DBPreparableInterface
{
    use Authenticatable;

    protected const MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE = 'item_does_not_exist';
    protected const MESSAGE_ITEM_COULD_NOT_BE_DELETED = 'item_could_not_be_deleted';
    protected string $table;
    protected string $primaryKey = 'id';
    protected array $messages = [];
    protected array $fillableColumns = [];
    protected string $model;

    /**
     * @throws Exception
     */
    public function getAll(array $filterData = []): Paginator
    {
        try {
            $filter = $this->getFilterData($filterData);
            $query = $this->getQuery();

            if (isset($filter['search']) && strlen($filter['search']) > 0) {
                $query = $this->filterSearchQuery($query, $filter['search']);
            }

            return $query->orderBy($filter['orderBy'], $filter['order'])
                ->paginate($filter['perPage']);
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * @throws Exception
     */
    public function getAllLogs(array $filterData = []): Paginator
    {
        try {
            $filter = $this->getFilterData($filterData);
            $query = $this->getQuery();

            if (isset($filter['search']) && strlen($filter['search']) > 0) {
                $query = $this->filterSearchQuery($query, $filter['search']);
            }

            return $query->orderBy($filter['orderBy'], $filter['order'])
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
            'order' => 'desc'
        ];

        return array_merge($defaultArgs, $filterData);
    }

    protected function getQuery(): Builder
    {
        return DB::table($this->table);
    }

    protected function filterSearchQuery(Builder|EloquentBuilder $query, string $searchedText): Builder|EloquentBuilder
    {
        return $query;
    }

    public function getCount(array $filterData = []): int
    {
        return $this->getQuery()->count();
    }

    /**
     * @throws Exception
     */
    public function create(array $data): int|bool|object
    {
        $data = $this->prepareForDB($data);
        try {
            $test = $this->getQuery()->insertGetId($data);
            $model_data = $this->model::find($test);
            activity()
                ->causedBy(auth()->user())
                ->performedOn($model_data)
                ->withProperties([
                    'data' => $data,
                    'id' => $test,
                ])
                ->log('Created');
            return $test;
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function prepareForDB(array $data, ?object $item = null): array
    {
        if (count($this->fillableColumns) === 0) {
            return $data;
        }

        $preparedData = [];
        foreach ($this->fillableColumns as $column) {
            if (isset($data[$column])) {
                $preparedData[$column] = $data[$column] ?? null;
            }
        }

        return $preparedData;
    }

    /**
     * @throws Exception
     */
    public function update(int $id, array $data): ?object
    {
        $item = $this->getById($id);

        try {
            $data = $this->prepareForDB($data, $item);
            $updated = $this->getQuery()
                ->where("{$this->table}.{$this->primaryKey}", $id)
                ->update($data);

            if ($updated) {
                $item = $this->getById($id);
            }
            $model_data = $this->model::find($id);

            activity()
                ->causedBy(auth()->user())
                ->performedOn($model_data)
                ->withProperties([
                    'data' => $updated,
                    'id' => $item,
                ])
                ->log('Updated');

            return $item;
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @throws Exception
     */
    public function getById(int $id, array $selects = ['*']): ?object
    {
        return $this->getByColumn("{$this->table}.{$this->primaryKey}", $id, $selects);
    }

    /**
     * @throws Exception
     */
    public function getByColumn(string $columnName, $columnValue, array $selects = ['*']): ?object
    {
        try {
            $item = $this->getQuery()
                ->where($columnName, $columnValue)
                ->select($selects)
                ->first();

            if (empty($item)) {
                throw new Exception(
                    $this->getExceptionMessage(static::MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE),
                    Response::HTTP_NOT_FOUND
                );
            }

            return $item;
        } catch (Exception $exception) {
            throw new Exception($exception);
        }
    }

    protected function getExceptionMessage(string $key): string
    {
        return $this->getExceptionMessages()[$key];
    }

    protected function getExceptionMessages(): array
    {
        return [
            static::MESSAGE_ITEM_DOES_NOT_EXIST_MESSAGE => __('Item does not exist.'),
            static::MESSAGE_ITEM_COULD_NOT_BE_DELETED => __('Item could not be deleted.'),
        ];
    }

    /**
     * @throws Exception
     */
    public function delete(int $id): ?object
    {
        $item = $this->getById($id);

        try {
            // Find the model by ID
            $model_data = $this->model::find($id);

            // Check if the model exists
            if (!$model_data) {
                throw new Exception("Item not found with ID: $id", Response::HTTP_NOT_FOUND);
            }

            // Delete the model_data
            $deleted = $this->getQuery()
                ->where($this->primaryKey, $id)
                ->delete();

            if ($deleted) {
                // Log the activity if the deletion was successful
                activity()
                    ->causedBy(auth()->user())
                    ->performedOn($model_data)
                    ->withProperties([
                        'data' => $deleted,
                        'id' => $id,
                    ])
                    ->log('Deleted');
            } else {
                throw new Exception("Failed to delete item with ID: $id", Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        if (!$deleted) {
            throw new Exception(
                $this->getExceptionMessage(static::MESSAGE_ITEM_COULD_NOT_BE_DELETED),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return $item;
    }

    /**
     * @throws Exception
     */
    public function getDropdown(): array
    {
        $columns = array_unique(
            array_merge(
                [$this->primaryKey],
                $this->getDropdownSelectableColumns()
            )
        );

        $dropdown = (new Dropdown())
            ->setTableName($this->table)
            ->setSelectedColumns($columns)
            ->setOrderByColumnWithOrders($this->getOrderByColumnWithOrders())
            ->setSelectableTableQuery();

        $dropdown->setQuery($this->getDropdownAdditionalWhere($dropdown->getQuery()));

        return $dropdown->getDropdowns();
    }

    /**
     * @throws Exception
     */
    protected function getDropdownSelectableColumns(): array
    {
        throw new Exception('This method must be called from child repository.');
    }

    /**
     * @throws Exception
     */
    protected function getOrderByColumnWithOrders(): array
    {
        throw new Exception('This method must be called from child repository.');
    }

    protected function getDropdownAdditionalWhere(Builder $query): Builder
    {
        return $query;
    }

    protected function getNextAutoIncrementId(?string $table = null): int
    {
        $tableName = $table ?? $this->table;
        $tableInfo = DB::select(DB::raw("SHOW CREATE TABLE $tableName"));
        $tableCreateStatement = $tableInfo[0]->{'Create Table'};
        preg_match('/AUTO_INCREMENT=(\d+)/', $tableCreateStatement, $matches);
        return $matches[1] ?? 1;
    }
}
