import PrivateRoute from '@/components/_utlities/privateRoute';
import EmployeeForm from '@/components/employees/EmployeeForm';

export default function EmployeeCreatePage() {
    return (
        <PrivateRoute permission='employee.create'>
            <EmployeeForm
                id={0}
                pageType='create'
            />
        </PrivateRoute>
    )
}