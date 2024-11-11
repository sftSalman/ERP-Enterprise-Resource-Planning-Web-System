import PrivateRoute from '@/components/_utlities/privateRoute';
import DepartmentList from '@/components/department/DepartmentList';

export default function EmployeeListPage() {
    return (
        <PrivateRoute permission='employee.view'>
            <DepartmentList />
        </PrivateRoute>
    )
}