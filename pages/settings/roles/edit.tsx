import { useRouter } from 'next/router'

import RoleForm from "@/components/roles/RoleForm";
import PrivateRoute from '@/components/_utlities/privateRoute';

export default function EditPage() {
    const router = useRouter();
    const { id } = router.query;

    if (id !== undefined && isNaN(id)) {
        return router.push('/roles');
    }

    return (
        <PrivateRoute permission='role.edit'>
            <RoleForm
                id={parseInt(id)}
                pageType="edit"
            />
        </PrivateRoute>
    )
}