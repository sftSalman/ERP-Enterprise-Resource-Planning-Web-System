import PrivateRoute from '@/components/_utlities/privateRoute';
import SubDivisionForm from '@/components/sub_division/SubDivisionForm';

export default function DepartmentCreatePage() {
    return (
        <PrivateRoute permission='department.create'>
            <SubDivisionForm
                id={0}
                pageType='create'
            />
        </PrivateRoute>
    )
}