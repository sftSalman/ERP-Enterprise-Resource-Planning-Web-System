<?php

namespace Modules\Hrm\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChildDivision extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'child_divisions';

    protected $fillable = ['name', 'code', 'sub_division_id'];


    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function subdivision()
    {
        return $this->belongsTo(Subdivision::class);
    }
}
