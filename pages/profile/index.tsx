import PrivateRoute from '@/components/_utlities/privateRoute';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { getAuthData } from '@/utils/auth';

export default function EmployeeEditPage() {
  const id = getAuthData()?.id;
  const isAgent = !(getAuthData()?.is_head_office ?? 1);

  return (
    <PrivateRoute permission='profile.view'>
      <EmployeeForm
        id={typeof id === undefined || id === null ? 0 : parseInt(id + '')}
        pageType='profile'
        isAgent={isAgent}
      />
    </PrivateRoute>
  )
}