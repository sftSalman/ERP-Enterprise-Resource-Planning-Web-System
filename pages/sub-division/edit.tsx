import PrivateRoute from '@/components/_utlities/privateRoute';
import SubDivisionForm from '@/components/sub_division/SubDivisionForm';
import { useRouter } from 'next/router';

export default function EmployeeEditPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PrivateRoute permission='department.edit'>
      <SubDivisionForm
        id={typeof id === undefined || id === null ? 0 : parseInt(id + '')}
        pageType='edit'
      />
    </PrivateRoute>
  )
}