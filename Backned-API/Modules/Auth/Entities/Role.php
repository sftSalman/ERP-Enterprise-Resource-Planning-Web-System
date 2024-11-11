<?php

namespace Modules\Auth\Entities;

use Exception;
use Spatie\Permission\Contracts\Role as RoleContract;
use Spatie\Permission\Guard;

class Role extends \Spatie\Permission\Models\Role
{
    protected $fillable = [
        'name',
        'code',
        'guard_name',
        'deletable',
        'sum_assured_limit',
    ];

    /**
     * @throws Exception
     */
    public static function findByCode(string $code, $guardName = null): RoleContract
    {
        $guardName = $guardName ?? Guard::getDefaultName(static::class);

        $role = static::findByParam(['code' => $code, 'guard_name' => $guardName]);

        if (! $role) {
            throw new Exception("There is no role by code `{$code}`.");
        }

        return $role;
    }
}
