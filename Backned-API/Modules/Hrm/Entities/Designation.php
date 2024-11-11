<?php

namespace Modules\Hrm\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Designation extends Model
{
    use HasFactory;

    public const TABLE_NAME = 'designations';

    protected $fillable = ['name','code'];
}
