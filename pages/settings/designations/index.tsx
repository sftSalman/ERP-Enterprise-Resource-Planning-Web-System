import PrivateRoute from "@/components/_utlities/privateRoute";
import DesignationList from "@/components/designations";

export default function StampsPage() {
    return (
        <PrivateRoute permission="designation.view">
            <DesignationList />
        </PrivateRoute>
    );
}
