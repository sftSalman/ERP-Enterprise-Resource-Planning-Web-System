import PrivateRoute from '@/components/_utlities/privateRoute';
import DepartmentForm from '@/components/department/DepartmentForm';

export default function DepartmentCreatePage() {
    return (
        <PrivateRoute permission='department.create'>
            <DepartmentForm
                id={0}
                pageType='create'
            />
        </PrivateRoute>
    )
}