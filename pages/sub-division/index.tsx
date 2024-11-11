import PrivateRoute from '@/components/_utlities/privateRoute';
import SubDivisionList from '@/components/sub_division/SubDivisionList';

export default function EmployeeListPage() {
    return (
        <PrivateRoute permission='employee.view'>
            <SubDivisionList />
        </PrivateRoute>
    )
}