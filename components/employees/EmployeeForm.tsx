import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import Loading from '@/components/loading';
import Button from '@/components/button';
import Input from '@/components/input';
import PageHeader from '@/components/layouts/PageHeader';
import { PageContent } from '@/components/layouts/PageContent';
// import { useDebounced } from '@/hooks/use-debounce';
import { getDesignationDropdownList } from '@/redux/actions/designation-action';
import { changeInputValue, createEmployee, getEmployeeDetails, getEmployeeRolesDropdownList, getManagerDropdownList, updateEmployee } from '@/redux/actions/employee-action';
import Select from '@/components/select';
import { getBase64 } from '@/utils/file-helper';
import ValidationMessage from '../validationMessage';
import { numberValidation } from '@/utils/numberValidation';
import { getDepartmentDropdownList } from '@/redux/actions/department-action';
import { getChildDivisionDropdownList } from '@/redux/actions/child-division-action';
import { getSubDivisionDropdownList } from '@/redux/actions/sub-division-action';
import { getDivisionDropdownList } from '@/redux/actions/division-action';

interface IEmployeeForm {
    id: number;
    pageType: 'create' | 'edit' | 'profile';
    isAgent?: boolean;
}

export default function EmployeeForm({ id, pageType, isAgent = false }: IEmployeeForm) {
    const router = useRouter();
    const dispatch = useDispatch();
    const defaultPassword = 'admin@123';

    const { designationDropdownList } = useSelector((state: RootState) => state.designation);
    console.log('designationDropdownList', designationDropdownList)
    const { divisionDropdownList } = useSelector((state: RootState) => state.division);
    const { subDivisionDropdownList } = useSelector((state: RootState) => state.subDivision);
    const { childDivisionDropdownList } = useSelector((state: RootState) => state.childDivision);
    const { departmentDropdownList } = useSelector((state: RootState) => state.department);
    const { employeeInput, isSubmitting, isLoadingDetails, rolesDropdownList, managerDropdownList } = useSelector((state: RootState) => state.employee);
    const [isValidNumber, setIsValidNumber] = useState(null);

    const debouncedDispatch = useCallback(
        debounce(() => {
            if (id > 0) {
                dispatch(getEmployeeDetails(id, isAgent));
            }
        }, 500),
        [id, isAgent]
    );

    useEffect(() => {
        debouncedDispatch();
        dispatch(getDesignationDropdownList());
        dispatch(getManagerDropdownList());
        dispatch(getDepartmentDropdownList());
        dispatch(getDivisionDropdownList());
        dispatch(getSubDivisionDropdownList());
        dispatch(getChildDivisionDropdownList());
        dispatch(getEmployeeRolesDropdownList(isAgent));
        return debouncedDispatch.cancel;
    }, [debouncedDispatch]);

    const handleChangeTextInput = async (name: string, value: any, e: any) => {
        if (name === 'avatar') {
            await getBase64(value, (result: any) => {
                dispatch(changeInputValue(name, result, e));
            });
        } else {
            dispatch(changeInputValue(name, value, e));
        }
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        const formattedInputObject = {
            ...employeeInput,
            // branch_ids: employeeInput.branch_ids.map(branch => branch.value)
        }

        if (pageType === 'create') {
            dispatch(createEmployee(formattedInputObject, router));
        } else {
            dispatch(updateEmployee(formattedInputObject, router, pageType));
        }
    }

    const getMainPageTitle = () => {
        if (pageType === 'profile') {
            return 'Profile';
        } else if (isAgent) {
            return 'Officer/Manager';
        }

        return 'Employee';
    }

    const getPageTitle = () => {
        let title = '';
        if (pageType === 'create') {
            title += 'New ';
        } else if (pageType === 'edit' || pageType === 'profile') {
            title += 'Edit ';
        }

        title += getMainPageTitle();

        return title;
    }


    const handleChangeMobileNumber = (name: string, value: number) => {
        handleChangeTextInput(name, value);
        setIsValidNumber(numberValidation(value));
    }
    // const levelDropDownList=[
    //     {id:1,label:'Level One',name:'Level One',value:1},
    //     {id:2,label:'Level Two',name:'Level Two',value:2},
    //     {id:3,label:'Level Three',name:'Level Three',value:3},
    //     {id:4,label:'Level Four',name:'Level Four',value:4},
    // ];

    return (
        <>
            <PageHeader
                title={getPageTitle()}
                hasSearch={false}
            />
            <PageContent>
                {
                    isLoadingDetails &&
                    <div className="text-center">
                        <Loading
                            loadingTitle={`${getMainPageTitle()} Details...`}
                        />
                    </div>
                }

                {isLoadingDetails === false && typeof employeeInput !== "undefined" && employeeInput !== null && (
                    <form
                        method="post"
                        autoComplete="off"
                        encType="multipart/form-data"
                    >
                        <div className="grid gap-2 grid-cols-1 md:grid-cols-6">
                            <div className="col-span-2">
                                <label htmlFor={''} className="text-sm font-medium text-gray-900 block mb-2">
                                    {pageType === 'profile' ? 'Profile' : 'Employee'} Photo
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            <img src={`http://127.0.0.1:8000/storage/employees/avatars/` + employeeInput.avatar} alt={employeeInput.first_name} className="h-50 w-50" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (MAX. 1MB)</p>
                                        </div>
                                        <input id="dropzone-file" name='avatar' type="file" onChange={(e: any) => handleChangeTextInput('avatar', e.target.files[0], e)} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className='md:ml-4 col-span-4'>
                                <div className='grid gap-2 grid-cols-1 md:grid-cols-2'>
                                    <Input
                                        label="First Name"
                                        name="first_name"
                                        placeholder='First Name'
                                        value={employeeInput.first_name}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                    />
                                    <Input
                                        label="Last Name"
                                        name="last_name"
                                        placeholder='Last Name'
                                        value={employeeInput.last_name}
                                        isRequired={false}
                                        inputChange={handleChangeTextInput}
                                    />
                                    <Input
                                        label="Email"
                                        name="email"
                                        placeholder='Email'
                                        type='email'
                                        value={employeeInput.email}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                        isCapitalize={false}
                                    />
                                    <div>
                                        <Input
                                            label="Phone"
                                            name="phone"
                                            placeholder='Phone'
                                            // type='number'
                                            value={employeeInput.phone}
                                            minLength={11}
                                            maxLength={11}
                                            isRequired={true}
                                            inputChange={handleChangeMobileNumber}
                                        />
                                        {
                                            typeof isValidNumber !== "undefined" && isValidNumber !== null && <>
                                                {
                                                    isValidNumber ?
                                                        <ValidationMessage message="The provided number is valid" textColor="green-600" /> :
                                                        <ValidationMessage message="Invalid Mobile Number. Please enter a 11-digit number." />
                                                }
                                            </>
                                        }
                                    </div>
                                    {
                                        pageType !== 'profile' &&
                                        <>
                                            <Select
                                                options={designationDropdownList}
                                                isSearchable={true}
                                                name="designation_id"
                                                label="Designation"
                                                isRequired={true}
                                                defaultValue={employeeInput.designation_id}
                                                placeholder='Select Designation...'
                                                handleChangeValue={handleChangeTextInput}
                                            />
                                            <Select
                                                options={divisionDropdownList}
                                                isSearchable={true}
                                                name="division_id"
                                                label="Division"
                                                isRequired={true}
                                                defaultValue={employeeInput.division_id}
                                                placeholder='All Division...'
                                                handleChangeValue={handleChangeTextInput}
                                            />
                                            <Select
                                                options={subDivisionDropdownList}
                                                isSearchable={true}
                                                name="sub_division_id"
                                                isMulti={false}
                                                label="Sub Division"
                                                defaultValue={employeeInput.sub_division_id}
                                                placeholder='All Sub Division...'
                                                handleChangeValue={handleChangeTextInput}
                                            />
                                            <Select
                                                options={childDivisionDropdownList}
                                                isSearchable={true}
                                                name="child_division_id"
                                                isMulti={false}
                                                label="Child Division"
                                                defaultValue={employeeInput.child_division_id}
                                                placeholder='All Child Division...'
                                                handleChangeValue={handleChangeTextInput}
                                            />
                                            <Select
                                                options={departmentDropdownList}
                                                isSearchable={true}
                                                name="department_ids"
                                                isMulti={true}
                                                label="Departments"
                                                defaultValue={employeeInput.department_ids}
                                                placeholder='All departments...'
                                                handleChangeValue={handleChangeTextInput}
                                            />
                                            <Select
                                                options={rolesDropdownList}
                                                isSearchable={true}
                                                name="role_id"
                                                label="Assign Role"
                                                defaultValue={employeeInput.role_id}
                                                placeholder='Select role...'
                                                handleChangeValue={handleChangeTextInput}
                                            />
                                        </>
                                    }
                                    <Input
                                        label="Password"
                                        name="password"
                                        placeholder='Password'
                                        type='password'
                                        value={employeeInput.password}
                                        inputChange={handleChangeTextInput}
                                        hintText={pageType === 'create' ? `Default password - ${defaultPassword}` : ''}
                                    />
                                </div>
                            </div>

                        </div>

                        <Button
                            title='Save'
                            loadingTitle="Saving..."
                            onClick={(e) => onSubmit(e)}
                            loading={isSubmitting}
                        />
                    </form>
                )
                }
            </PageContent>
        </>
    )
}