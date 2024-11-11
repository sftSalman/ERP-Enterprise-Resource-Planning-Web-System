<?php

namespace Modules\Auth\Entities;

use Exception;
use Illuminate\Http\Request;

class ProfilePermission extends PermissionChecker
{
    public const PERMISSION_VIEW = 'profile.view';
    public const PERMISSION_EDIT = 'profile.edit';

    protected function getErrorMessages(string $permissionKey): string
    {
        $errorMessages = [
            static::PERMISSION_VIEW => __('You have no permission to view your profile.'),
            static::PERMISSION_EDIT => __('You have no permission to edit your profile.'),
        ];

        return $errorMessages[$permissionKey];
    }

    /**
     * @throws Exception
     */
    public function canViewProfile(int $id): bool
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
    public function canUpdateProfile(Request $request, int $id): bool
    {
        $hasEditPermission = $this->hasPermissions(static::PERMISSION_EDIT);

        if (!$hasEditPermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_EDIT));
        }

        return true;
    }
}
