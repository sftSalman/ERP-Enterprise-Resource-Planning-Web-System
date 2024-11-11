import PrivateRoute from "@/components/_utlities/privateRoute";
import Roles from "@/components/roles";

export default function RolePage() {
    return (
        <PrivateRoute permission="role.view">
            <Roles />
        </PrivateRoute>
    )
}