import PrivateRoute from '@/components/_utlities/privateRoute';
import ChildDivisionForm from '@/components/child_division/ChildDivisionForm';
import { useRouter } from 'next/router';

export default function EmployeeEditPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PrivateRoute permission='department.edit'>
      <ChildDivisionForm
        id={typeof id === undefined || id === null ? 0 : parseInt(id + '')}
        pageType='edit'
      />
    </PrivateRoute>
  )
}