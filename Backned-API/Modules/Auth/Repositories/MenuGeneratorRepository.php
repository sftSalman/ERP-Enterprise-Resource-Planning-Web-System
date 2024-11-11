<?php

namespace Modules\Auth\Repositories;

use Exception;
use Modules\Auth\Entities\DashboardPermission;
use Modules\Auth\Entities\DepartmentPermission;
use Modules\Auth\Entities\DesignationPermission;
use Modules\Auth\Entities\EmployeePermission;
use Modules\Auth\Entities\Menu;
use Modules\Auth\Entities\OccupationPermission;
use Modules\Auth\Entities\RolePermission;
use Modules\Auth\Interfaces\MenuGeneratorInterface;
use Symfony\Component\HttpFoundation\Response;

class MenuGeneratorRepository implements MenuGeneratorInterface
{
    /** @var Menu[] */
    private array $menus;

    private $user;

    public function __construct(
        private readonly DashboardPermission     $dashboardPermission,
        private readonly EmployeePermission      $employeePermission,
        private readonly DesignationPermission   $designationPermission,
        private readonly DepartmentPermission    $departmentPermission,
        private readonly RolePermission          $rolePermission,
        private readonly OccupationPermission    $occupationPermission,
    ) {
        $this->menus = [];
        $this->user = request()->user();
    }

    public function generate(): self
    {
        try {
            $this->createDashboardMenu()
                ->createEmployeeMenu()
                ->createDepartmentMenu()
                ->createConfigurationMenu();
        } catch (Exception $exception) {
        }

        return $this;
    }

    private function createConfigurationMenu(): self
    {


        $configurationDesignationPermissions = [
            $this->designationPermission::PERMISSION_VIEW,
            $this->designationPermission::PERMISSION_CREATE,
            $this->designationPermission::PERMISSION_EDIT,
            $this->designationPermission::PERMISSION_DELETE,
        ];

        $departmentPermissions = [
            $this->departmentPermission::PERMISSION_VIEW,
            $this->departmentPermission::PERMISSION_CREATE,
            $this->departmentPermission::PERMISSION_EDIT,
            $this->departmentPermission::PERMISSION_DELETE,
        ];

        $configurationRolePermissions = [
            $this->rolePermission::PERMISSION_VIEW,
            $this->rolePermission::PERMISSION_CREATE,
            $this->rolePermission::PERMISSION_EDIT,
            $this->rolePermission::PERMISSION_DELETE,
        ];

        $occupationPermission = [
            $this->occupationPermission::PERMISSION_CREATE,
            $this->occupationPermission::PERMISSION_EDIT,
            $this->occupationPermission::PERMISSION_VIEW,
            $this->occupationPermission::PERMISSION_DELETE
        ];

        if ($this->user->hasAnyPermission(array_merge(
            $configurationDesignationPermissions,
            $configurationRolePermissions,
            $occupationPermission,
            $departmentPermissions
        ))) {
            $subMenus = [];
            if ($this->user->hasAnyPermission($configurationRolePermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Activity Log'))
                    ->setUrl('/activity-log')
                    ->setIcon('bi-person')
                    ->setPriority(1)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission($configurationDesignationPermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Manage Designations'))
                    ->setUrl('/settings/designations')
                    ->setIcon('bi-person-rolodex')
                    ->setPriority(5)
                    ->setSubMenu([]);
            }

            
            if ($this->user->hasAnyPermission($configurationRolePermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Manage Roles'))
                    ->setUrl('/settings/roles')
                    ->setIcon('bi-shield-check')
                    ->setPriority(6)
                    ->setSubMenu([]);
            }
            $this->menus['configuration'] = (new Menu())
                ->setTitle(__('Configurations'))
                ->setUrl('/settings')
                ->setIcon('bi-gear')
                ->setPriority(10000)
                ->setSubMenu($subMenus);
        }

        return $this;
    }

    private function createEmployeeMenu(): self
    {
        $employeePermissions = [
            $this->employeePermission::PERMISSION_VIEW,
            $this->employeePermission::PERMISSION_CREATE,
            $this->employeePermission::PERMISSION_EDIT,
            $this->employeePermission::PERMISSION_DELETE,
        ];

        if ($this->user->hasAnyPermission(array_merge(
            $employeePermissions,
        ))) {
            $subMenus = [];
            if ($this->user->hasAnyPermission($employeePermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Employees List'))
                    ->setUrl('/employee')
                    ->setIcon('bi-person')
                    ->setPriority(1)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission([$this->employeePermission::PERMISSION_CREATE])) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('New Employee'))
                    ->setUrl('/employee/create')
                    ->setIcon('bi-person-add')
                    ->setPriority(2)
                    ->setSubMenu([]);
            }

            $this->menus['employees'] = (new Menu())
                ->setTitle(__('Manage Employee'))
                ->setUrl('/employee')
                ->setIcon('bi-people')
                ->setPriority(30)
                ->setSubMenu($subMenus);
        }

        return $this;
    }

    private function createDepartmentMenu(): self
    {
        $departmentPermissions = [
            $this->departmentPermission::PERMISSION_VIEW,
            $this->departmentPermission::PERMISSION_CREATE,
            $this->departmentPermission::PERMISSION_EDIT,
            $this->departmentPermission::PERMISSION_DELETE,
        ];

        if ($this->user->hasAnyPermission(array_merge(
            $departmentPermissions,
        ))) {
            $subMenus = [];
            if ($this->user->hasAnyPermission($departmentPermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Division List'))
                    ->setUrl('/division')
                    ->setIcon('bi-building-check')
                    ->setPriority(1)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission([$this->employeePermission::PERMISSION_CREATE])) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('New Division'))
                    ->setUrl('/division/create')
                    ->setIcon('bi-building-add')
                    ->setPriority(2)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission($departmentPermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Sub Division List'))
                    ->setUrl('/sub-division')
                    ->setIcon('bi-building-check')
                    ->setPriority(3)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission([$this->employeePermission::PERMISSION_CREATE])) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('New Sub Division'))
                    ->setUrl('/sub-division/create')
                    ->setIcon('bi-building-add')
                    ->setPriority(4)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission($departmentPermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Child Division List'))
                    ->setUrl('/child-division')
                    ->setIcon('bi-building-check')
                    ->setPriority(5)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission([$this->employeePermission::PERMISSION_CREATE])) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('New Child Division'))
                    ->setUrl('/child-division/create')
                    ->setIcon('bi-building-add')
                    ->setPriority(6)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission($departmentPermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Department List'))
                    ->setUrl('/department')
                    ->setIcon('bi-building-check')
                    ->setPriority(7)
                    ->setSubMenu([]);
            }

            if ($this->user->hasAnyPermission([$this->employeePermission::PERMISSION_CREATE])) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('New Department'))
                    ->setUrl('/department/create')
                    ->setIcon('bi-building-add')
                    ->setPriority(8)
                    ->setSubMenu([]);
            }

            $this->menus['departments'] = (new Menu())
                ->setTitle(__('Manage Level'))
                ->setUrl('/department')
                ->setIcon('bi-building')
                ->setPriority(31)
                ->setSubMenu($subMenus);
        }

        return $this;
    }

    private function createDashboardMenu(): self
    {
        $dashboardPermissions = [
            $this->dashboardPermission::PERMISSION_VIEW,
        ];
        $financialDashboardPermissions = [
            $this->dashboardPermission::PERMISSION_FINANCIAL_DASHBOARD,
        ];

        if ($this->user->hasAnyPermission(array_merge(
            $dashboardPermissions,
            $financialDashboardPermissions
        ))) {
            $subMenus = [];
            if ($this->user->hasAnyPermission($dashboardPermissions)) {
                $subMenus[] = (new Menu())
                    ->setTitle(__('Dashboard'))
                    ->setUrl('/')
                    ->setIcon('bi-speedometer2')
                    ->setPriority(1)
                    ->setSubMenu([]);
            }

            $this->menus['dashboard'] = (new Menu())
                ->setTitle(__('Dashboard'))
                ->setUrl('/')
                ->setIcon('bi-speedometer2')
                ->setPriority(1)
                ->setSubMenu($subMenus);
        }

        return $this;
    }

    /**
     * @throws Exception
     */
    public function get(): array
    {
        try {
            return $this->getNormalizedMenus($this->menus, true);
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param Menu[] $menus
     * @param bool $isParent
     * @return array
     */
    private function getNormalizedMenus(array $menus, bool $isParent): array
    {
        $normalizedMenus = [];

        foreach ($menus as $menuKey => $menu) {
            $normalizedMenus[$menuKey] = [
                'title' => $menu->getTitle(),
                'icon' => $menu->getIcon(),
                'priority' => $menu->getPriority(),
                'url' => $menu->getUrl(),
                'submenu' => $this->getNormalizedMenus($menu->getSubMenu(), false),
            ];
        }

        usort($normalizedMenus, function ($menuA, $menuB) {
            return $menuA['priority'] <=> $menuB['priority'];
        });

        return $normalizedMenus;
    }
}
