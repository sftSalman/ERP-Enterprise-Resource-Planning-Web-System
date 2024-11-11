import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, Alert } from 'flowbite-react';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';

import Table from '@/components/table';
import { deleteRoleAction, getRoleListAction } from '@/redux/actions/role-action';
import { RootState } from '@/redux/store';
import Loading from '@/components/loading';
import PageHeader from '@/components/layouts/PageHeader';
import DeleteModal from '@/components/delete/DeleteModal';
import NewButton from '@/components/button/button-new';
import { PageContentList } from '@/components/layouts/PageContentList';
import ActionButtons from '@/components/button/button-actions';
import NoTableDataFound from '@/components/table/NoDataFound';
import { Toaster } from '@/components/toaster';
import { formatCurrency } from '@/utils/currency';

export default function Roles() {
    const dispatch = useDispatch();
    const router = useRouter();
    const columnData = [
        { title: "SL", id: 1 },
        { title: "Role", id: 2 },
        { title: "Sum assured limit", id: 3 },
        { title: "For Head-office", id: 4 },
        { title: "Permissions", id: 5 },
        { title: "Action", id: 6 },
    ]

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [dataLimit, setDataLimit] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>('');
    const { isLoading, roleList, rolesListPaginated } = useSelector((state: RootState) => state.role);
    const [rollID, setRollID] = useState<any>(0);

    const onDelete = () => {
        dispatch(deleteRoleAction(deleteId));
        setShowDeleteModal(false);
    }

    const debouncedDispatch = useCallback(
        debounce(() => {
            dispatch(getRoleListAction(currentPage, dataLimit, searchText));
        }, 500),
        [currentPage, dataLimit, searchText]
    );

    useEffect(() => {
        debouncedDispatch(); // call debounced dispatch function
        return debouncedDispatch.cancel; // cleanup the debounced function
    }, [debouncedDispatch]);


    const toggleAccordion = (id: number) => {
        setRollID(prevRollID => (prevRollID === id ? null : id));
    };

    return (
        <div>
            <PageHeader
                title='Roles'
                searchPlaceholder='Search roles by name...'
                searchText={searchText}
                onSearchText={setSearchText}
                headerRightSide={<NewButton href='/settings/roles/create' element='Add New' />}
            />

            <PageContentList>
                {
                    isLoading ?
                        <div className="text-center">
                            <Loading loadingTitle="Role List" />
                        </div> :
                        <Table
                            column={columnData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            dataLimit={dataLimit}
                            totalData={rolesListPaginated.total}
                        >
                            {
                                roleList && roleList.length > 0 && roleList.map((data: any, index: number) => (
                                    <tr className="bg-white border-b hover:bg-gray-50" key={index + 1}>
                                        <th scope="row" className="px-2 py-3 font-normal text-gray-900 break-words w-6" >
                                            {index + 1}
                                        </th>
                                        <td className="px-2 py-3 font-normal text-gray-900 break-words w-48">
                                            {data.name}
                                        </td>
                                        <td className="px-2 py-3 font-normal text-gray-900 break-words w-48">
                                            {formatCurrency(data.sum_assured_limit)}
                                        </td>
                                        <td className="px-2 py-3 font-normal text-gray-900 break-words w-48">
                                            {data.is_head_office ? 'Yes' : 'No'}
                                        </td>
                                        <td className="px-2 py-1 font-normal text-gray-900 break-words" >
                                            <div className='max-w-[500px]'>
                                                {
                                                    data.permissions && data.permissions.length > 0 &&
                                                    <Accordion
                                                        collapseAll={rollID !== data.id ? false : true}
                                                    >
                                                        <Accordion.Panel isOpen={rollID === data.id ? true : false}>
                                                            <Accordion.Title className='py-0 my-0' onClick={() => toggleAccordion(data.id)}>
                                                                {data.permissions.length ?? 0} Permissions
                                                            </Accordion.Title>
                                                            {rollID === data.id && (
                                                                <Accordion.Content className="py-1 my-1">
                                                                    {data.permissions.map((permission, permissionIndex) => (
                                                                        <span
                                                                            key={permissionIndex + 1}
                                                                            className="bg-blue-500 text-[10px] text-white py-0 m-0.5 px-0.5 rounded-md inline-flex"
                                                                        >
                                                                            {permission.name}
                                                                        </span>
                                                                    ))}
                                                                </Accordion.Content>
                                                            )}
                                                        </Accordion.Panel>
                                                    </Accordion>
                                                }

                                                {
                                                    data.permissions && data.permissions.length === 0 &&
                                                    <Alert
                                                        color="failure"
                                                    >
                                                        No Permissions added.
                                                    </Alert>
                                                }
                                            </div>
                                        </td>

                                        <td className="px-2 py-3 text-right min-w-[100px]">
                                            <ActionButtons
                                                items={[
                                                    {
                                                        element: 'Edit',
                                                        onClick: () => router.push(`/settings/roles/edit?id=${data.id}`),
                                                        iconClass: 'pencil'
                                                    },
                                                    {
                                                        element: 'Delete',
                                                        onClick: () => {
                                                            if (!data.deletable) {
                                                                Toaster('error', 'This role could not be deleted.');
                                                                return;
                                                            }

                                                            setShowDeleteModal(true);
                                                            setDeleteId(data.id)
                                                        },
                                                        iconClass: 'trash'
                                                    }
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }

                            {
                                roleList && roleList.length === 0 &&
                                <NoTableDataFound colSpan={6}>No roles found ! Please create a role.</NoTableDataFound>
                            }
                        </Table>
                }
            </PageContentList>

            <DeleteModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                onDelete={onDelete}
            />
        </div >
    )
}
