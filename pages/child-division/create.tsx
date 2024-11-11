import PrivateRoute from '@/components/_utlities/privateRoute';
import ChildDivisionForm from '@/components/child_division/ChildDivisionForm';

export default function ChildDivision() {
    return (
        <PrivateRoute permission='department.create'>
            <ChildDivisionForm
                id={0}
                pageType='create'
            />
        </PrivateRoute>
    )
}