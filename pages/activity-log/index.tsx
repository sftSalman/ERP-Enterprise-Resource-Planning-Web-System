import PrivateRoute from '@/components/_utlities/privateRoute';
import ActivityLog from '@/components/activity_log/ActivityLog';

export default function EmployeeListPage() {
    return (
        <PrivateRoute permission='employee.view'>
            <ActivityLog />
        </PrivateRoute>
    )
}