<?php

namespace Modules\Auth\Entities;

use Exception;
use Illuminate\Http\Request;

class EmployeePermission extends PermissionChecker
{
    public const PERMISSION_VIEW = 'employee.view';
    public const PERMISSION_CREATE = 'employee.create';
    public const PERMISSION_EDIT = 'employee.edit';
    public const PERMISSION_DELETE = 'employee.delete';
    public const PERMISSION_APPROVE = 'employee.approve';

    protected function getErrorMessages(string $permissionKey): string
    {
        $errorMessages = [
            static::PERMISSION_VIEW => __('You have no permission to view employees.'),
            static::PERMISSION_CREATE => __('You have no permission to create a new employee.'),
            static::PERMISSION_EDIT => __('You have no permission to edit the employee.'),
            static::PERMISSION_DELETE => __('You have no permission to delete the employee.'),
            static::PERMISSION_APPROVE => __('You have no permission to approve the employee.'),
        ];

        return $errorMessages[$permissionKey];
    }

    /**
     * @throws Exception
     */
    public function canViewEmployees(): bool
    {
        if (!$this->hasPermissions(static::PERMISSION_VIEW)) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_VIEW));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canViewEmployee(int $id): bool
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
    public function canCreateEmployee(Request $request): bool
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
    public function canUpdateEmployee(Request $request, int $id): bool
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
    public function canDeleteEmployee(int $id): bool
    {
        $hasDeletePermission = $this->hasPermissions(static::PERMISSION_DELETE);

        if (!$hasDeletePermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_DELETE));
        }

        return true;
    }
}
