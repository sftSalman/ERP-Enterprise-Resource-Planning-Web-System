import { Modal as ModalComponent } from "flowbite-react";
import Button from '@/components/button';

interface IPermissionModal {
    title?: React.ReactNode | string,
    isDismissible?: boolean,
    show: boolean,
    size?: string,
    handleClose: any,
    status?: string,
    handleAction: any,
    isLoading?: boolean,
    loadingText?: string,
}

export default function PermissionModal({ title = "Are you want to delete this?", isDismissible = false, show, size = "md", handleClose, status = "warning", handleAction, isLoading = false, loadingText = "Deleting..." }: IPermissionModal) {

    return (
        <div>
            <ModalComponent
                show={show}
                size={size}
                position="center"
                onClose={handleClose}
                dismissible={isDismissible}
            >
                <ModalComponent.Body>

                    <div className="text-gray-900 text-center flex flex-col justify-center items-center">
                        {
                            status === "warning" ?
                                <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5.5C12.5523 5.5 13 5.94772 13 6.5L13 13.5C13 14.0523 12.5523 14.5 12 14.5C11.4477 14.5 11 14.0523 11 13.5L11 6.5C11 5.94772 11.4477 5.5 12 5.5Z" fill="red" />
                                    <path d="M12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5Z" fill="red" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" fill="red" />
                                </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" stroke="#090" strokeWidth="20px" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 771.48 784.38">
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="Layer_1-2" data-name="Layer 1">
                                            <g id="Layer_37" data-name="Layer 37">
                                                <path className="cls-1" d="M756.93,173.13A594.51,594.51,0,0,1,391.18,771.88h0l-5.63-2.13a594.63,594.63,0,0,1-371-601L385.68,12.5Z" />
                                                <polygon className="cls-1" points="160.68 346.75 259.68 542.63 658.55 248.88 262.8 443.63 160.68 346.75" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                        }

                        <h2 className='text-xl font-bold mt-4'> {title} </h2>

                    </div>
                    <div className='text-right flex justify-end gap-2 mt-5'>
                        <Button
                            title="Yes"
                            customClass="inline py-2 px-3 rounded-md"
                            loading={isLoading}
                            loadingTitle={loadingText}
                            onClick={() => handleAction()}
                        />
                        <Button
                            title="No"
                            customClass="bg-gray-900 inline py-2 px-3 rounded-md"
                            onClick={handleClose}
                        />
                    </div>
                </ModalComponent.Body>
            </ModalComponent>
        </div>
    )
}