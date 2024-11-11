import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getPermissionNames } from '@/utils/permission';

interface PrivateRouteProps {
    children: ReactNode;
    permission: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, permission }) => {

    const router = useRouter();
    const { isLoading, sideMenuList } = useSelector((state: RootState) => state.global);
    const permissionTags = getPermissionNames()

    useEffect(() => {
        // Check if the given permission is not in the permissions array
        if (!permissionTags.includes(permission)) {
            if (!isLoading) {
                if (sideMenuList.length > 0 && sideMenuList[0]?.submenu && sideMenuList[0].submenu.length > 0) {
                    router.push(sideMenuList[0].submenu[0].url);
                }
            }
        }
    }, [router, permissionTags, permission, isLoading]);

    return (
        <>{children}</>
    )
};

export default PrivateRoute;
