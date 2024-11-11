<?php

namespace Modules\Auth\Repositories;

use App\Abstracts\EntityRepository;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Modules\Auth\Entities\ActivityLog;
use Modules\Hrm\Entities\Department;
use Modules\Hrm\Entities\Division;
use Modules\Hrm\Entities\Employee;
use Modules\Hrm\Entities\SubDivision;
use Symfony\Component\HttpFoundation\Response;

class DashboardReporsitory extends EntityRepository
{
    public string $table = ActivityLog::TABLE_NAME;
    public array $totalCounting=[];

    public function __construct(
   ) {
   $this->totalCounting = [
       'total_division' => 0,
       'total_sub_division' => 0,

       'total_department' => 0,
       'total_employee' => 0,
   ];
}

    public function getCounting(){
        $this->totalCounting['total_division']=Division::count();
        $this->totalCounting['total_sub_division']=SubDivision::count();
        $this->totalCounting['total_department']=Department::count();
        $this->totalCounting['total_employee']=Employee::count();

        return $this->totalCounting;

    }
    
}
