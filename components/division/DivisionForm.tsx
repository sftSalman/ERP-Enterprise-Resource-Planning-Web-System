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
import { getDivisionDetails,changeInputValue, createDivision, updateDivision } from '@/redux/actions/division-action';

interface IDivisionForm {
    id: number;
    pageType: 'create' | 'edit' | 'profile';
}

export default function DivisionForm({ id, pageType}: IDivisionForm) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { divisionInput, isSubmitting, isLoadingDetails,divisionDetails } = useSelector((state: RootState) => state.division);


    const handleChangeTextInput = async (name: string, value: any, e: any) => {
         dispatch(changeInputValue(name, value, e));
    };

    const debouncedDispatch = useCallback(
        debounce(() => {
            if (id > 0) {
                dispatch(getDivisionDetails(id));
            }
        }, 500),
        [id]
    );

    useEffect(() => {
        debouncedDispatch();
        return debouncedDispatch.cancel;
    }, [debouncedDispatch]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        const formattedInputObject = {
            ...divisionInput,
        }

        if (pageType === 'create') {
            dispatch(createDivision(formattedInputObject, router));
        } else {
            dispatch(updateDivision(formattedInputObject, router, pageType));
        }
    }

    const getMainPageTitle = () => {
        return 'Division';
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

                {isLoadingDetails === false && typeof divisionInput !== "undefined" && divisionInput !== null && (
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
                                        placeholder='Division Name'
                                        value={divisionInput.name}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
                                    />
                                    <Input
                                        label="Code"
                                        name="code"
                                        placeholder='Code'
                                        value={divisionInput.code}
                                        isRequired={true}
                                        inputChange={handleChangeTextInput}
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