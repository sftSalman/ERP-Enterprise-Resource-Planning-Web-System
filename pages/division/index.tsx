import PrivateRoute from '@/components/_utlities/privateRoute';
import DivisionList from '@/components/division/DivisionList';

export default function EmployeeListPage() {
    return (
        <PrivateRoute permission='employee.view'>
            <DivisionList />
        </PrivateRoute>
    )
}