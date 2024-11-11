import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import Loading from '@/components/loading';
import Button from '@/components/button';
import { debounce } from 'lodash';
import Input from '@/components/input';
import PageHeader from '@/components/layouts/PageHeader';
import { PageContent } from '@/components/layouts/PageContent';
import { useCallback, useEffect } from 'react';
import Select from '../select';
import { changeInputValue, createChildDivision, getChildDivisionDetails, updateChildDivision } from '@/redux/actions/child-division-action';
import { getSubDivisionDropdownList } from '@/redux/actions/sub-division-action';

interface IChildDivisionForm {
    id: number;
    pageType: 'create' | 'edit' | 'profile';
}

export default function ChildDivisionForm({ id, pageType }: IChildDivisionForm) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { childDivisionInput, isSubmitting, isLoadingDetails, childDivisionDetails } = useSelector((state: RootState) => state.childDivision);
    const { subDivisionDropdownList } = useSelector((state: RootState) => state.subDivision);


    const handleChangeTextInput = async (name: string, value: any, e: any) => {
        dispatch(changeInputValue(name, value, e));
    };

    const debouncedDispatch = useCallback(
        debounce(() => {
            if (id > 0) {
                dispatch(getChildDivisionDetails(id));
            }
        }, 500),
        [id]
    );

    useEffect(() => {
        debouncedDispatch();
        dispatch(getSubDivisionDropdownList());
        return debouncedDispatch.cancel;
    }, [debouncedDispatch]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        const formattedInputObject = {
            ...childDivisionInput,
        }

        if (pageType === 'create') {
            dispatch(createChildDivision(formattedInputObject, router));
        } else {
            dispatch(updateChildDivision(formattedInputObject, router, pageType));
        }
    }

    const getMainPageTitle = () => {
        return 'Child Division';
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

                {isLoadingDetails === false && typeof childDivisionInput !== "undefined" && childDivisionInput !== null && (
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
                                        placeholder='Child Division Name'
                                        value={childDivisionInput.name}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                    />
                                    <Input
                                        label="Code"
                                        name="code"
                                        placeholder='Code'
                                        value={childDivisionInput.code}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                    />
                                    <Select
                                        options={subDivisionDropdownList}
                                        isSearchable={true}
                                        name="sub_division_id"
                                        label="Sub Division"
                                        isRequired={true}
                                        defaultValue={childDivisionInput.sub_division_id}
                                        placeholder='Select Sub Division...'
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