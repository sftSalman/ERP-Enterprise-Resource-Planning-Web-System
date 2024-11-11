<?php

namespace Modules\Auth\Entities;

use Exception;
use Illuminate\Http\Request;

class OccupationPermission extends PermissionChecker
{
    public const PERMISSION_VIEW = 'occupation.view';
    public const PERMISSION_CREATE = 'occupation.create';
    public const PERMISSION_EDIT = 'occupation.edit';
    public const PERMISSION_DELETE = 'occupation.delete';
    public const PERMISSION_SUPER_ADMIN = 'occupation.super_admin';

    protected function getErrorMessages(string $permissionKey): string
    {
        $errorMessages = [
            static::PERMISSION_VIEW => __('You have no permission to view occupations.'),
            static::PERMISSION_CREATE => __('You have no permission to create a new occupation.'),
            static::PERMISSION_EDIT => __('You have no permission to edit the occupation.'),
            static::PERMISSION_DELETE => __('You have no permission to delete the occupation.'),
        ];

        return $errorMessages[$permissionKey];
    }

    /**
     * @throws Exception
     */
    public function canViewOccupations(): bool
    {
        if (!$this->hasPermissions(static::PERMISSION_VIEW)) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_VIEW));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canViewOccupation(int $id): bool
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
    public function canCreateOccupation(Request $request): bool
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
    public function canUpdateOccupation(Request $request, int $id): bool
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
    public function canDeleteOccupation(int $id): bool
    {
        $hasDeletePermission = $this->hasPermissions(static::PERMISSION_DELETE);

        if (!$hasDeletePermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_DELETE));
        }

        return true;
    }
}
