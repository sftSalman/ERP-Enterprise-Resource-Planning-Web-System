<?php

namespace Modules\Hrm\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubDivision extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'sub_divisions';

    protected $fillable = ['name','code','division_id'];


    public function childDivisions()
    {
        return $this->hasMany(ChildDivision::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
