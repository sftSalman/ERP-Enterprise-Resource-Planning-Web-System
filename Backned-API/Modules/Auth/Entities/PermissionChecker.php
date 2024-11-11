<?php

namespace Modules\Auth\Entities;

use Exception;
use Illuminate\Contracts\Auth\Authenticatable;
use Symfony\Component\HttpFoundation\Response;

abstract class PermissionChecker
{
    /**
     * @throws Exception
     */
    public function checkAuthResponse(bool $isAuthorized, ?string $authorizationMessage = null): void
    {
        if (!$isAuthorized) {
            throw new Exception(
                empty($authorizationMessage) ? $this->getDefaultAuthorizationErrorMessage() : $authorizationMessage,
                Response::HTTP_UNAUTHORIZED
            );
        }
    }

    protected function getDefaultAuthorizationErrorMessage(): string
    {
        return __('You are not authorized to do this action.');
    }

    abstract protected function getErrorMessages(string $permissionKey): string;

    /**
     * @throws Exception
     */
    protected function hasPermissions(mixed $permissions): bool
    {
        $permissions = (array)is_array($permissions) ? $permissions : [$permissions];

        return $this->getAuthUser()->hasAnyPermission($permissions);
    }

    /**
     * @throws Exception
     */
    protected function getAuthUser(): Authenticatable
    {
        $authenticatedUser = request()->user();

        if (!$authenticatedUser) {
            throw new \Exception(
                __('Please be authenticated to do this action.'),
                Response::HTTP_UNAUTHORIZED
            );
        }

        return $authenticatedUser;
    }

    /**
     * @throws Exception
     */
    protected function throwUnAuthorizedException(string $message)
    {
        throw new Exception($message, Response::HTTP_FORBIDDEN);
    }
}
