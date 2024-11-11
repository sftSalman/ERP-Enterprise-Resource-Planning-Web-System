<?php

namespace Modules\Auth\Entities;

use Exception;
use Illuminate\Http\Request;

class RolePermission extends PermissionChecker
{
    public const PERMISSION_VIEW = 'role.view';
    public const PERMISSION_CREATE = 'role.create';
    public const PERMISSION_EDIT = 'role.edit';
    public const PERMISSION_DELETE = 'role.delete';
    public const PERMISSION_SUPER_ADMIN = 'role.super_admin';

    protected function getErrorMessages(string $permissionKey): string
    {
        $errorMessages = [
            static::PERMISSION_VIEW => __('You have no permission to view roles.'),
            static::PERMISSION_CREATE => __('You have no permission to create a new role.'),
            static::PERMISSION_EDIT => __('You have no permission to edit the role.'),
            static::PERMISSION_DELETE => __('You have no permission to delete the role.'),
        ];

        return $errorMessages[$permissionKey];
    }

    /**
     * @throws Exception
     */
    public function canViewRoles(): bool
    {
        if (!$this->hasPermissions(static::PERMISSION_VIEW)) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_VIEW));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canViewRole(int $id): bool
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
    public function canCreateRole(Request $request): bool
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
    public function canUpdateRole(Request $request, int $id): bool
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
    public function canDeleteRole(int $id): bool
    {
        $hasDeletePermission = $this->hasPermissions(static::PERMISSION_DELETE);

        if (!$hasDeletePermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_DELETE));
        }

        return true;
    }
}
