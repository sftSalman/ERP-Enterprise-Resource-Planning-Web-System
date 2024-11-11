<?php

namespace Modules\Auth\Entities;

use Exception;
use Illuminate\Http\Request;

class DepartmentPermission extends PermissionChecker
{
    public const PERMISSION_VIEW = 'department.view';
    public const PERMISSION_CREATE = 'department.create';
    public const PERMISSION_EDIT = 'department.edit';
    public const PERMISSION_DELETE = 'department.delete';
    public const PERMISSION_SUPER_ADMIN = 'department.super_admin';

    protected function getErrorMessages(string $permissionKey): string
    {
        $errorMessages = [
            static::PERMISSION_VIEW => __('You have no permission to view departments.'),
            static::PERMISSION_CREATE => __('You have no permission to create a new department.'),
            static::PERMISSION_EDIT => __('You have no permission to edit the department.'),
            static::PERMISSION_DELETE => __('You have no permission to delete the department.'),
        ];

        return $errorMessages[$permissionKey];
    }

    /**
     * @throws Exception
     */
    public function canViewDepartments(): bool
    {
        if (!$this->hasPermissions(static::PERMISSION_VIEW)) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_VIEW));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canViewDepartment(int $id): bool
    {
        $hasViewPermission = $this->hasPermissions(static::PERMISSION_VIEW);

        if (!$hasViewPermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_VIEW));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canCreateDepartment(Request $request): bool
    {
        $hasCreatePermission = $this->hasPermissions(static::PERMISSION_CREATE);

        if (!$hasCreatePermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_CREATE));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canUpdateDepartment(Request $request, int $id): bool
    {
        $hasEditPermission = $this->hasPermissions(static::PERMISSION_EDIT);

        if (!$hasEditPermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_EDIT));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canDeleteDepartment(int $id): bool
    {
        $hasDeletePermission = $this->hasPermissions(static::PERMISSION_DELETE);

        if (!$hasDeletePermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_DELETE));
        }

        return true;
    }
}
