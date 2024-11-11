import PrivateRoute from "@/components/_utlities/privateRoute";
import RoleForm from "@/components/roles/RoleForm";

export default function CreatePage() {
    return (
        <PrivateRoute permission="role.create">
            <RoleForm
                id={0}
                pageType="create"
            />
        </PrivateRoute>
    )
}