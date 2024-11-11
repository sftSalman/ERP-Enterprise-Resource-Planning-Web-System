import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { RootState } from '@/redux/store';
import { permissionGroupCheckboxSelectAction, emptyRoleStatusMessage, getPermissionGroups, permissionCheckboxSelectAction, allpermissionCheckboxSelectAction, changeRoleInputAction, storeRoleAction, checkGroupPermissionIsChecked, checkAllPermissionIsChecked, getRoleDetailsDataAction } from '@/redux/actions/role-action';
import Loading from '@/components/loading';
import Button from '@/components/button';
import Input from '@/components/input';
import PageHeader from '@/components/layouts/PageHeader';
import { PageContent } from '@/components/layouts/PageContent';
import { useDebounced } from '@/hooks/use-debounce';
import { debounce } from 'lodash';

interface IRoleForm {
    id: number;
    pageType: 'create' | 'edit';
}

const RoleForm = ({ id, pageType }: IRoleForm) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { inputData, isLoading } = useSelector((state: RootState) => state.role);

    useDebounced(() => {
        if (pageType === 'create') {
            dispatch(emptyRoleStatusMessage());
            dispatch(getPermissionGroups());
        }
    });

    const roleCheck = (e, indexChild, permissionGroupIndex) => {
        let checkboxStatus = e.target.checked;
        dispatch(permissionCheckboxSelectAction(checkboxStatus, indexChild, permissionGroupIndex, inputData));
    }

    const checkPermissionGroup = (e, index, checkboxStatus) => {
        dispatch(permissionGroupCheckboxSelectAction(index, checkboxStatus, inputData));
    }

    const allChecked = (e) => {
        let checkStausCheck = e.target.checked;
        dispatch(allpermissionCheckboxSelectAction(checkStausCheck, inputData));
    }

    const changeRoleInput = (name: string, value: any) => {
        dispatch(changeRoleInputAction(name, value));
    }

    const debouncedDispatch = useCallback(
        debounce(() => {
            dispatch(getRoleDetailsDataAction(id));
        }, 500),
        [id]
    );

    useEffect(() => {
        debouncedDispatch(); // call debounced dispatch function
        return debouncedDispatch.cancel; // cleanup the debounced function
    }, [debouncedDispatch]);


    const onFormSubmit = (e: any) => {
        e.preventDefault();
        dispatch(storeRoleAction(inputData, router));
    }

    const SubmitButton = <Button
        onClick={onFormSubmit}
        title='Save'
        loadingTitle="Saving..."
        loading={isLoading}
        customClass='px-6'
    />

    return (
        <div>
            <PageHeader
                title={pageType === 'create' ? 'New role' : 'Edit role'}
                hasSearch={false}
                pageTitleRightSide={SubmitButton}
            />

            <PageContent>
                {
                    isLoading && <div className='text-center'>
                        <Loading loadingTitle="permissions..." />
                    </div>
                }
                {
                    !isLoading &&
                    <form method="post" autoComplete="off">
                        <div className="">
                            <div className="flex flex-row flex-wrap flex-1"> 
                                <Input
                                    label="Role name"
                                    name="role"
                                    placeholder="Give a role name"
                                    value={inputData.role}
                                    isRequired={true}
                                    inputChange={changeRoleInput}
                                    areaClassNames='flex-1'
                                />
                                <Input
                                    label="Max sum assured limit"
                                    name="sum_assured_limit"
                                    placeholder="eg: 100000"
                                    value={inputData.sum_assured_limit}
                                    isRequired={true}
                                    inputChange={changeRoleInput}
                                    areaClassNames='flex-1 ml-5'
                                />
                                <Input
                                    type='checkbox'
                                    label="For head-office"
                                    name="is_head_office"
                                    value={inputData.is_head_office}
                                    checked={inputData.is_head_office ? true : false}
                                    inputChange={changeRoleInput}
                                    areaClassNames='flex-1 ml-5'
                                />
                            </div>

                            {
                                inputData.groupList.length > 0 &&
                                <div className="flex items-center my-3">
                                    <label className="text-sm font-medium text-gray-900 mr-8">Permissions</label>
                                    <input
                                        id="all_permission_checked"
                                        checked={checkAllPermissionIsChecked(inputData.groupList)}
                                        onChange={allChecked}
                                        type="checkbox"
                                        className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2 mr-2"
                                    />
                                    <label htmlFor="all_permission_checked" className="text-sm font-medium text-gray-900">All</label>
                                </div>
                            }
                        </div>
                        <div>
                            {
                                inputData.groupList.length > 0 && inputData.groupList.map((permissionGroup: any, permissionGroupIndex: any) => (
                                    <div className='flex' key={permissionGroupIndex}>
                                        <div className="basis-full md:basis-2/12">
                                            <div className="flex items-center my-3">
                                                <input
                                                    id={`group-${permissionGroupIndex}`}
                                                    checked={checkGroupPermissionIsChecked(permissionGroup, permissionGroupIndex)}
                                                    type="checkbox"
                                                    onClick={(e) => checkPermissionGroup(e, permissionGroupIndex, permissionGroup.isChecked ? false : true)}
                                                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2 mr-2"
                                                />
                                                <label htmlFor={`group-${permissionGroupIndex}`} className="text-sm font-medium text-gray-900">{permissionGroup.name}</label>
                                            </div>
                                        </div>
                                        <div className="basis-full md:basis-10/12 grid gap-2 grid-cols-1 md:grid-cols-4 border-b py-2">
                                            {
                                                permissionGroup && permissionGroup.permissions.length > 0 && permissionGroup.permissions.map((permission: any, indexChild: any) => (
                                                    <div className="flex items-center my-2" key={indexChild}>
                                                        <input
                                                            id={`group-child-${permission.name}`}
                                                            checked={permission.isChecked}
                                                            type="checkbox"
                                                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2 mr-2"
                                                            onClick={(e) => roleCheck(e, indexChild, permissionGroupIndex)}
                                                        />
                                                        <label htmlFor={`group-child-${permission.name}`} className="text-sm font-medium text-gray-900">{permission.printName}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="my-3">
                            {SubmitButton}
                        </div>
                    </form>
                }
            </PageContent>
        </div>
    );
};

export default RoleForm;
