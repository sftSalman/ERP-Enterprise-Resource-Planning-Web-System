<?php

namespace Modules\Hrm\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'departments';

    protected $fillable = ['name','code','child_division_id'];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_departments');
    }

    public function childDivision()
    {
        return $this->belongsTo(ChildDivision::class);
    }
}
