import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import { RootState } from '@/redux/store';
import Modal from '@/components/modal';
import Table from '@/components/table';
import Button from '@/components/button';
import Loading from '@/components/loading';
import PageHeader from '@/components/layouts/PageHeader';
import NewButton from '@/components/button/button-new';
import { PageContentList } from '@/components/layouts/PageContentList';
import ActionButtons from '@/components/button/button-actions';
import NoTableDataFound from '@/components/table/NoDataFound';
import DesignationForm from './DesignationForm';
import DesignationDetails from './DesignationDetails';
import { getDesignationListAction, getDesignationDetailsAction, deleteDesignationAction, emptyDesignationInputAction } from '@/redux/actions/designation-action';

export default function DesignationList() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [designationID, setDesignationID] = useState<number | null>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataLimit, setDataLimit] = useState<number>(20);
  const [searchText, setSearchText] = useState<string>('');

  const { designationList, paginationData, isLoading, isDeleting } = useSelector((state: RootState) => state.designation);

  const columnData: any[] = [
    { title: "Name", id: 1 },
    { title: "Code", id: 2 },
    { title: "Action", id: 3 },
  ]

  const debouncedDispatch = useCallback(
    debounce(() => {
      dispatch(getDesignationListAction(currentPage, dataLimit, searchText));
    }, 500),
    [currentPage, dataLimit, searchText]
  );

  useEffect(() => {
    debouncedDispatch();
    return debouncedDispatch.cancel;
  }, [debouncedDispatch]);

  const handleOpenModal = (id: number, type: string) => {
    if (type === "view") {
      setShowDetailsModal(true);
      setDesignationID(id);
      dispatch(getDesignationDetailsAction(id));
    } else if (type === "edit") {
      setShowUpdateModal(true);
      setDesignationID(id);
      dispatch(getDesignationDetailsAction(id));
    } else {
      setShowDeleteModal(true);
      setDesignationID(id);
    }
  }

  return (
    <div>
      <PageHeader
        title='Designations'
        searchText={searchText}
        onSearchText={setSearchText}
        searchPlaceholder='Search designation...'
        headerRightSide={<NewButton
          onClick={() => {
            dispatch(emptyDesignationInputAction());
            setShowModal(true);
          }}
          element='New Designation' />}
      />

      <PageContentList>
        {
          isLoading ?
            <div className="text-center">
              <Loading loadingTitle="Designation" />
            </div> :

            <Table
              column={columnData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              dataLimit={dataLimit}
              totalData={designationList.length > 0 && paginationData.total}
            >
              {designationList && designationList.length > 0 && designationList.map((data: any, index: number) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-left" key={index + 1}>
                  <th scope="row" className="px-2 py-3 font-normal text-gray-900 break-words" >
                    {data.name ?? "N/A"}
                  </th>
                  <th scope="row" className="px-2 py-3 font-normal text-gray-900 break-words" >
                    {data.code ?? "N/A"}
                  </th>

                  <td className="px-2 py-3 flex gap-1">
                    <ActionButtons
                      items={[
                        // {
                        //   element: 'View',
                        //   onClick: () => handleOpenModal(data.id, 'view'),
                        //   iconClass: 'eye'
                        // },
                        {
                          element: 'Edit',
                          onClick: () => handleOpenModal(data.id, 'edit'),
                          iconClass: 'pencil'
                        },
                        {
                          element: 'Delete',
                          onClick: () => handleOpenModal(data.id, 'delete'),
                          iconClass: 'trash'
                        }
                      ]}
                    />
                  </td>
                </tr>
              ))
              }

              {
                designationList && designationList.length === 0 &&
                <div className="text-center">
                  <NoTableDataFound colSpan={5}>No designation found ! Please add a new designation.</NoTableDataFound>
                </div>
              }
            </Table>
        }
      </PageContentList>

      <Modal
        title={`New Designation`}
        size="md" show={showModal}
        handleClose={() => setShowModal(false)}
        isDismissible={false}
      >
        <DesignationForm designationID={designationID} pageType="create" closeModal={setShowModal} />
      </Modal>

      <Modal
        title={`Designation Details`}
        size="md" show={showDetailsModal}
        handleClose={() => setShowDetailsModal(false)}
        isDismissible={false}
      >
        <DesignationDetails designationID={designationID} />
      </Modal>

      <Modal
        title={`Update Designation`}
        size="md" show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        isDismissible={false}
      >
        <DesignationForm designationID={designationID} pageType="edit" closeModal={setShowUpdateModal} />
      </Modal>


      <Modal title="Delete designation" size="md" show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} isDismissible={false} isShowHeader={false}>
        <div className="text-gray-900 text-center flex flex-col justify-center items-center">
          <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5.5C12.5523 5.5 13 5.94772 13 6.5L13 13.5C13 14.0523 12.5523 14.5 12 14.5C11.4477 14.5 11 14.0523 11 13.5L11 6.5C11 5.94772 11.4477 5.5 12 5.5Z" fill="red" />
            <path d="M12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5Z" fill="red" />
            <path fillRule="evenodd" clipRule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" fill="red" />
          </svg>
          <h2 className='text-2xl font-bold mt-2'> Are You Sure To Delete? </h2>

        </div>
        <div className='text-right flex justify-end gap-2'>
          <Button
            title="Yes"
            customClass="inline py-2 px-3 rounded-md"
            loading={isDeleting}
            loadingTitle="Deleting Designation..."
            onClick={() => dispatch(deleteDesignationAction(designationID, setShowDeleteModal))} />
          <Button title="No" customClass="bg-gray-900 inline py-2 px-3 rounded-md" onClick={() => setShowDeleteModal(false)} />
        </div>
      </Modal>
    </div >
  )
}