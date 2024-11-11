<?php

namespace Modules\Auth\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

class ActivityLog extends Model
{
    use HasFactory;
    public const TABLE_NAME = 'activity_logs';
    protected $fillable = [
        'log_name',
        'description',
        'subject_id',
        'causer_id',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public static function activity_log($name, $description,$sub_id)
    {
        return $sub_id;
        DB::table('activity_logs')->insert([
            'log_name' => $name ?? null,
            'description' => $description ?? null,
            'causer_id' => auth()->user()->id ?? null,
            'subject_id' => $sub_id ?? null,
        ]);
    }
}
