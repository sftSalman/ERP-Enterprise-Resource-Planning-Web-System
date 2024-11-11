<?php

namespace Modules\Auth\Entities;

use Exception;
use Illuminate\Http\Request;

class DashboardPermission extends PermissionChecker
{
    public const PERMISSION_VIEW = 'dashboard.view';
    public const PERMISSION_FINANCIAL_DASHBOARD = 'financial_dashboard';
    public const PERMISSION_POLICY_DASHBOARD = 'policy_dashboard';

    protected function getErrorMessages(string $permissionKey): string
    {
        $errorMessages = [
            static::PERMISSION_VIEW => __('You have no permission to view dashboard.'),
            static::PERMISSION_FINANCIAL_DASHBOARD => __('You have no permission to view financial dashboard.'),
            static::PERMISSION_POLICY_DASHBOARD => __('You have no permission to view policy dashboard.'),
        ];

        return $errorMessages[$permissionKey];
    }

    /**
     * @throws Exception
     */
    public function canViewDashboard(): bool
    {
        if (!$this->hasPermissions(static::PERMISSION_VIEW)) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_VIEW));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canViewFinancialDashboard(int $id): bool
    {
        $hasViewPermission = $this->hasPermissions(static::PERMISSION_FINANCIAL_DASHBOARD);

        if (!$hasViewPermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_FINANCIAL_DASHBOARD));
        }

        return true;
    }

    /**
     * @throws Exception
     */
    public function canViewPolicyDashboard(Request $request): bool
    {
        $hasCreatePermission = $this->hasPermissions(static::PERMISSION_POLICY_DASHBOARD);

        if (!$hasCreatePermission) {
            $this->throwUnAuthorizedException($this->getErrorMessages(static::PERMISSION_POLICY_DASHBOARD));
        }

        return true;
    }
}
