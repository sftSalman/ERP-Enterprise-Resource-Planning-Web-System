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
import { getSubDivisionDetails, changeInputValue, updateSubDivision, createSubDivision } from '@/redux/actions/sub-division-action';
import Select from '../select';
import { getDivisionDropdownList } from '@/redux/actions/division-action';

interface ISubDivisionForm {
    id: number;
    pageType: 'create' | 'edit' | 'profile';
}

export default function SubDivisionForm({ id, pageType }: ISubDivisionForm) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { subDivisionInput, isSubmitting, isLoadingDetails, subDivisionDetails } = useSelector((state: RootState) => state.subDivision);
    const { divisionDropdownList } = useSelector((state: RootState) => state.division);


    const handleChangeTextInput = async (name: string, value: any, e: any) => {
        dispatch(changeInputValue(name, value, e));
    };

    const debouncedDispatch = useCallback(
        debounce(() => {
            if (id > 0) {
                dispatch(getSubDivisionDetails(id));
            }
        }, 500),
        [id]
    );

    useEffect(() => {
        debouncedDispatch();
        dispatch(getDivisionDropdownList());
        return debouncedDispatch.cancel;
    }, [debouncedDispatch]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        const formattedInputObject = {
            ...subDivisionInput,
        }

        if (pageType === 'create') {
            dispatch(createSubDivision(formattedInputObject, router));
        } else {
            dispatch(updateSubDivision(formattedInputObject, router, pageType));
        }
    }

    const getMainPageTitle = () => {
        return 'Sub Division';
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

                {isLoadingDetails === false && typeof subDivisionInput !== "undefined" && subDivisionInput !== null && (
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
                                        placeholder='Sub Division Name'
                                        value={subDivisionInput.name}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                    />
                                    <Input
                                        label="Code"
                                        name="code"
                                        placeholder='Code'
                                        value={subDivisionInput.code}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                    />
                                    <Select
                                        options={divisionDropdownList}
                                        isSearchable={true}
                                        name="division_id"
                                        label="Division"
                                        isRequired={true}
                                        defaultValue={subDivisionInput.division_id}
                                        placeholder='Select Division...'
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