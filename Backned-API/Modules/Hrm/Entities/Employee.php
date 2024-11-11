<?php

namespace Modules\Hrm\Entities;

use Illuminate\Support\Collection;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Employee extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    public const TABLE_NAME = 'employees';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'surname',
        'username',
        'email',
        'phone',
        'avatar',
        'password',
        'designation_id',
        "division_id",
        "sub_division_id",
        "child_division_id",
        "department_id",
        'manager_id',
        'is_head_office',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function findForPassport(string $email) {
        return $this->where('email', $email)->first();
    }

    public static function getpermissionGroups(): array
    {
        return Permission::select('group_name as name')
            ->groupBy('group_name')
            ->get()
            ->toArray();
    }

    public static function getpermissionsByGroupName($group_name): mixed
    {
        return Permission::select('name', 'id')
            ->where('group_name', $group_name)
            ->get();
    }

    public static function roleHasPermissions($role, $permissions): mixed
    {
        $hasPermission = true;

        foreach ($permissions as $permission) {
            if (!$role->hasPermissionTo($permission->name)) {
                $hasPermission = false;
                return $hasPermission;
            }
        }

        return $hasPermission;
    }

    public function getAllPermissionsByUser(): array
    {
        $permissions = [];

        // Get the user's roles and permissions
        $roles = $this->getRoleNames();
        $permissions = $this->getAllPermissions()->pluck('name')->toArray();

        // Loop through the roles and get their permissions
        foreach ($roles as $role) {
            $permissions = array_merge($permissions, Role::findByName($role)->getAllPermissions()->pluck('name')->toArray());
        }

        return array_unique($permissions);
    }

    public function getRoleCodes(): Collection
    {
        $this->loadMissing('roles');

        return $this->roles->pluck('code');
    }

    public function hasRoleCode(string $code): bool
    {
        $roleCodes = $this->getRoleCodes();
        return $roleCodes->contains($code);
    }


    public function children()
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    public function parent()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function subdivision()
    {
        return $this->belongsTo(SubDivision::class);
    }

    public function childDivision()
    {
        return $this->belongsTo(ChildDivision::class);
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'employee_departments');
    }
    
}
