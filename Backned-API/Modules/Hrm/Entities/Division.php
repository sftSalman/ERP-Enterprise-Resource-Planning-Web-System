<?php

namespace Modules\Hrm\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Division extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'divisions';

    protected $fillable = ['name','code'];

    public function subdivisions()
    {
        return $this->hasMany(SubDivision::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
