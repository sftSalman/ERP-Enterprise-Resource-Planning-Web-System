import PrivateRoute from '@/components/_utlities/privateRoute';
import DivisionForm from '@/components/division/DivisionForm';

export default function DepartmentCreatePage() {
    return (
        <PrivateRoute permission='department.create'>
            <DivisionForm
                id={0}
                pageType='create'
            />
        </PrivateRoute>
    )
}