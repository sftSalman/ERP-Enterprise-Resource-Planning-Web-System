<?php

namespace Modules\Auth\Entities;

use Exception;
use Illuminate\Http\Request;

class DesignationPermission extends PermissionChecker
{
    public const PERMISSION_VIEW = 'designation.view';
    public const PERMISSION_CREATE = 'designation.create';
    public const PERMISSION_EDIT = 'designation.edit';
    public const PERMISSION_DELETE = 'designation.delete';

    protected function getErrorMessages(string $permissionKey): string
    {
        $errorMessages = [
            static::PERMISSION_VIEW => __('You have no permission to view designations.'),
            static::PERMISSION_CREATE => __('You have no permission to create a new designation.'),
            static::PERMISSION_EDIT => __('You have no permission to edit the designation.'),
            static::PERMISSION_DELETE => __('You have no permission to delete the designation.'),
        ];

        return $errorMessages[$permissionKey];
    }

    /**
     * @throws Exception
     */
    public function canViewDesignations(): bool
    {
        if (!$this->hasPermissions(static::PERMISSION_VIEW)) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_VIEW));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canViewDesignation(int $id): bool
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
    public function canCreateDesignation(Request $request): bool
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
    public function canUpdateDesignation(Request $request, int $id): bool
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
    public function canDeleteDesignation(int $id): bool
    {
        $hasDeletePermission = $this->hasPermissions(static::PERMISSION_DELETE);

        if (!$hasDeletePermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_DELETE));
        }

        return true;
    }
}
