import Modal from "@/components/modal";
import Button from "@/components/button";
import { useState } from "react";

export interface IDeleteModalProps {
    showDeleteModal: boolean;
    setShowDeleteModal: (showModalOrNot: boolean) => void;
    isDeleting?: boolean;
    onDelete: () => void;
}

export default function DeleteModal({
    showDeleteModal,
    setShowDeleteModal,
    onDelete = () => { }
}: IDeleteModalProps) {
    const [deleting, setDeleting] = useState(false);

    const handleOnDelete = () => {
        setDeleting(true);
        setTimeout(() => {
            setDeleting(false);
            onDelete()
        }, 1000);
    }

    return (
        <Modal title="Delete a bank" size="md" show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} isDismissible={false} isShowHeader={false}>
            <div className="text-gray-900 text-center flex flex-col justify-center items-center">
                <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5.5C12.5523 5.5 13 5.94772 13 6.5L13 13.5C13 14.0523 12.5523 14.5 12 14.5C11.4477 14.5 11 14.0523 11 13.5L11 6.5C11 5.94772 11.4477 5.5 12 5.5Z" fill="red" />
                    <path d="M12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5Z" fill="red" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" fill="red" />
                </svg>
                <h2 className='text-2xl font-bold mt-2'> Are You Sure To Delete? </h2>
            </div>

            <div className='text-right flex justify-end gap-2 mt-3'>
                <Button
                    title="Yes"
                    customClass="inline py-2 px-3 rounded-md"
                    loading={deleting}
                    loadingTitle="Deleting..."
                    onClick={handleOnDelete} />

                <Button
                    title="No"
                    customClass="bg-gray-900 inline py-2 px-3 rounded-md"
                    onClick={() => setShowDeleteModal(false)}
                />
            </div>
        </Modal>
    );
}
