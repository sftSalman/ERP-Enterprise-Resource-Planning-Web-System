import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import Loading from '@/components/loading';
import Button from '@/components/button';
import { debounce } from 'lodash';
import Input from '@/components/input';
import PageHeader from '@/components/layouts/PageHeader';
import { PageContent } from '@/components/layouts/PageContent';
import { changeInputValue, createDepartment, getDepartmentDetails, updateDepartment } from '@/redux/actions/department-action';
import { useCallback, useEffect } from 'react';
import Select from '../select';
import { getChildDivisionDropdownList } from '@/redux/actions/child-division-action';

interface IDepartmentForm {
    id: number;
    pageType: 'create' | 'edit' | 'profile';
}

export default function DepartmentForm({ id, pageType }: IDepartmentForm) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { departmentInput, isSubmitting, isLoadingDetails, departmentDetails } = useSelector((state: RootState) => state.department);
    const { childDivisionDropdownList } = useSelector((state: RootState) => state.childDivision);
    const handleChangeTextInput = async (name: string, value: any, e: any) => {
        dispatch(changeInputValue(name, value, e));
    };

    const debouncedDispatch = useCallback(
        debounce(() => {
            if (id > 0) {
                dispatch(getDepartmentDetails(id));
            }
        }, 500),
        [id]
    );

    useEffect(() => {
        debouncedDispatch();
        dispatch(getChildDivisionDropdownList(id));
        return debouncedDispatch.cancel;
    }, [debouncedDispatch]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        const formattedInputObject = {
            ...departmentInput,
        }

        if (pageType === 'create') {
            dispatch(createDepartment(formattedInputObject, router));
        } else {
            dispatch(updateDepartment(formattedInputObject, router, pageType));
        }
    }

    const getMainPageTitle = () => {
        return 'Department';
    }

    const getPageTitle = () => {
        let title = '';
        if (pageType === 'create') {
            title += 'New ';
        } else if (pageType === 'edit') {
            title += 'Edit ';
        }

        title += getMainPageTitle();

        return title;
    }

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

                {isLoadingDetails === false && typeof departmentInput !== "undefined" && departmentInput !== null && (
                    <form
                        method="post"
                        autoComplete="off"
                        encType="multipart/form-data"
                    >
                        <div className="grid gap-2 grid-cols-1 md:grid-cols-1">

                            <div className='md:ml-4 col-span-4'>
                                <div className='grid gap-2 grid-cols-1 md:grid-cols-2'>
                                    <Input
                                        label="Name"
                                        name="name"
                                        placeholder='Department Name'
                                        value={departmentInput.name}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                    />
                                    <Input
                                        label="Code"
                                        name="code"
                                        placeholder='Code'
                                        value={departmentInput.code}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                    />

                                    <Select
                                        options={childDivisionDropdownList}
                                        isSearchable={true}
                                        name="child_division_id"
                                        label="Child Division"
                                        isRequired={true}
                                        defaultValue={departmentInput.child_division_id}
                                        placeholder='Select Child Division...'
                                        handleChangeValue={handleChangeTextInput}
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