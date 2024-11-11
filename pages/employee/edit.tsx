import PrivateRoute from '@/components/_utlities/privateRoute';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { useRouter } from 'next/router';

export default function EmployeeEditPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PrivateRoute permission='employee.edit'>
      <EmployeeForm
        id={typeof id === undefined || id === null ? 0 : parseInt(id + '')}
        pageType='edit'
      />
    </PrivateRoute>
  )
}