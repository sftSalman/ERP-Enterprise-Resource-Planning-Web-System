import PrivateRoute from '@/components/_utlities/privateRoute';
import ChildDivisionList from '@/components/child_division/ChildDivisionList';

export default function EmployeeListPage() {
    return (
        <PrivateRoute permission='employee.view'>
            <ChildDivisionList />
        </PrivateRoute>
    )
}