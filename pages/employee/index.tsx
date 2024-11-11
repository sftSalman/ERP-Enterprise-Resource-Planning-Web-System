import PrivateRoute from '@/components/_utlities/privateRoute';
import EmployeeList from '@/components/employees/EmployeeList';

export default function EmployeeListPage() {
    return (
        <PrivateRoute permission='employee.view'>
            <EmployeeList />
        </PrivateRoute>
    )
}