import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';

import Table from '@/components/table';
import Loading from '@/components/loading';
import PageHeader from '@/components/layouts/PageHeader';
import NewButton from '@/components/button/button-new';
import ActionButtons from '@/components/button/button-actions';
import StatusBadge from '@/components/badge/StatusBadge';
import NoTableDataFound from '@/components/table/NoDataFound';
import { RootState } from '@/redux/store';
import { PageContentList } from '@/components/layouts/PageContentList';
import { deleteEmployee, emptyEmployeeInputAction } from '@/redux/actions/employee-action';
import { IDepartmentView, IDivisionView, IEmployeeView } from '@/redux/interfaces';
import { hasPermission } from '@/utils/permission';
import PermissionModal from '../permissionModal';
import { deleteDivision, emptyDivisionInputAction, getDivisionListAction } from '@/redux/actions/division-action';

export default function DivisionList() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [departmentID, setDepartmentID] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [dataLimit, setDataLimit] = useState<number>(10);
    const { divisionList, divisionPaginationData, isLoading, isDeleting } = useSelector((state: RootState) => state.division);
    const [searchText, setSearchText] = useState<string>('');
    const columnData: any[] = [
        { title: "SL", id: 1 },
        { title: 'Name', id: 2 },
        { title: 'Code', id: 3 },
        { title: "Action", id: 4 },
    ];

    const debouncedDispatch = useCallback(
        debounce(() => {
            dispatch(getDivisionListAction(currentPage, dataLimit, searchText))
        }, 500),
        [currentPage, dataLimit, searchText]
    );

    useEffect(() => {
        debouncedDispatch();
        return debouncedDispatch.cancel;
    }, [debouncedDispatch]);


    const handleDeleteDivisionModal = (id: number) => {
        setShowDeleteModal(true);
        setDepartmentID(id);
    }

    const getActionButtons = (department: IDepartmentView) => {
        const actions = [];

        if (hasPermission('department.edit')) {
            actions.push({
                element: 'Edit',
                onClick: () => router.push(
                    `/division/edit?id=${department.id}`
                ),
                iconClass: 'pencil'
            });
        }

        if (hasPermission('department.delete')) {
            actions.push({
                element: 'Delete',
                onClick: () => handleDeleteDivisionModal(department.id),
                iconClass: 'trash'
            });
        }

        return actions;
    }

    return (
        <div>
            <PageHeader
                title={ 'Divisions'}
                searchPlaceholder={`Search departments...`}
                searchText={searchText}
                onSearchText={setSearchText}
                headerRightSide={
                    <NewButton
                        onClick={() => dispatch(emptyDivisionInputAction())}
                        href={'/division/create'}
                        element={'New Division'}
                    />
                }
            />

            <PageContentList>
                {
                    isLoading ?
                        <div className="text-center">
                            <Loading loadingTitle={'Divisions...'} />
                        </div> :
                        <Table
                            column={columnData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            dataLimit={dataLimit}
                            totalData={divisionPaginationData.total}
                        >
                            {
                                divisionList && divisionList.length > 0 && divisionList.map((division: IDivisionView, index: index) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-left" key={division.id}>
                                        <th scope="row" className="px-2 py-3 font-normal text-gray-900 break-words" >
                                            {index + 1}
                                        </th>
                                        <td className="px-2 py-3 font-normal text-gray-900 break-words" >
                                            {division.name}
                                        </td>
                                        <td className="px-2 py-3 font-normal text-gray-900 break-words" >
                                            {division.code}
                                        </td>

                                        <td className="px-2 py-3 flex gap-1">
                                            <ActionButtons
                                                items={getActionButtons(division)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }

                            {
                                divisionList && divisionList.length === 0 &&
                                <NoTableDataFound colSpan={9}>No Division found ! Please create one.</NoTableDataFound>
                            }
                        </Table>
                }
            </PageContentList>

            <PermissionModal
                show={showDeleteModal}
                status={"warning"}
                isLoading={isDeleting}
                loadingText={`Deleting Department`}
                handleClose={() => setShowDeleteModal(false)}
                handleAction={() => dispatch(deleteDivision(departmentID, setShowDeleteModal))}
            />
        </div >
    )
}