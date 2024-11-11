import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';

import Table from '@/components/table';
import Loading from '@/components/loading';
import PageHeader from '@/components/layouts/PageHeader';
import NewButton from '@/components/button/button-new';
import ActionButtons from '@/components/button/button-actions';
import NoTableDataFound from '@/components/table/NoDataFound';
import { RootState } from '@/redux/store';
import { PageContentList } from '@/components/layouts/PageContentList';
import { IDepartmentView } from '@/redux/interfaces';
import { hasPermission } from '@/utils/permission';
import PermissionModal from '../permissionModal';
import { deleteSubDivision, emptySubDivisionInputAction, getSubDivisionListAction } from '@/redux/actions/sub-division-action';

export default function SubDivisionList() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [departmentID, setDepartmentID] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [dataLimit, setDataLimit] = useState<number>(10);
    const { subDivisionList, subDivisionPaginationData, isLoading, isDeleting } = useSelector((state: RootState) => state.subDivision);
    const [searchText, setSearchText] = useState<string>('');
console.log('subDivisionList', subDivisionList)
    const columnData: any[] = [
        { title: "SL", id: 1 },
        { title: 'Name', id: 2 },
        { title: 'Code', id: 3 },
        { title: "Division", id: 4 },
        { title: "Action", id: 5 },
    ];

    const debouncedDispatch = useCallback(
        debounce(() => {
            dispatch(getSubDivisionListAction(currentPage, dataLimit, searchText))
        }, 500),
        [currentPage, dataLimit, searchText]
    );

    useEffect(() => {
        debouncedDispatch();
        return debouncedDispatch.cancel;
    }, [debouncedDispatch]);


    const handleDeleteSubDivisionModal = (id: number) => {
        setShowDeleteModal(true);
        setDepartmentID(id);
    }

    const getActionButtons = (department: IDepartmentView) => {
        const actions = [];

        if (hasPermission('department.edit')) {
            actions.push({
                element: 'Edit',
                onClick: () => router.push(
                    `/sub-division/edit?id=${department.id}`
                ),
                iconClass: 'pencil'
            });
        }

        if (hasPermission('department.delete')) {
            actions.push({
                element: 'Delete',
                onClick: () => handleDeleteSubDivisionModal(department.id),
                iconClass: 'trash'
            });
        }

        return actions;
    }

    return (
        <div>
            <PageHeader
                title={ 'Sub Division'}
                searchPlaceholder={`Search sub division...`}
                searchText={searchText}
                onSearchText={setSearchText}
                headerRightSide={
                    <NewButton
                        onClick={() => dispatch(emptySubDivisionInputAction())}
                        href={'/sub-division/create'}
                        element={'New Sub Division'}
                    />
                }
            />

            <PageContentList>
                {
                    isLoading ?
                        <div className="text-center">
                            <Loading loadingTitle={'Sub Division...'} />
                        </div> :
                        <Table
                            column={columnData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            dataLimit={dataLimit}
                            totalData={subDivisionPaginationData.total}
                        >
                            {
                                subDivisionList && subDivisionList.length > 0 && subDivisionList.map((department: IdepartmentView, index: index) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-left" key={department.id}>
                                        <th scope="row" className="px-2 py-3 font-normal text-gray-900 break-words" >
                                            {index + 1}
                                        </th>
                                        <td className="px-2 py-3 font-normal text-gray-900 break-words" >
                                            {department.name}
                                        </td>
                                        <td className="px-2 py-3 font-normal text-gray-900 break-words" >
                                            {department.code}
                                        </td>
                                        <td className="px-2 py-3 font-normal text-gray-900 break-words" >
                                            {department.division_name}
                                        </td>
                                        <td className="px-2 py-3 flex gap-1">
                                            <ActionButtons
                                                items={getActionButtons(department)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }

                            {
                                subDivisionList && subDivisionList.length === 0 &&
                                <NoTableDataFound colSpan={9}>No Department found ! Please create one.</NoTableDataFound>
                            }
                        </Table>
                }
            </PageContentList>

            <PermissionModal
                show={showDeleteModal}
                status={"warning"}
                isLoading={isDeleting}
                loadingText={`Deleting Sub DIvision`}
                handleClose={() => setShowDeleteModal(false)}
                handleAction={() => dispatch(deleteSubDivision(departmentID, setShowDeleteModal))}
            />
        </div >
    )
}