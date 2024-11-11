import { Modal as ModalComponent } from "flowbite-react";
interface IModal {
    title: React.ReactNode | string,
    children: React.ReactNode,
    isDismissible: any,
    show: boolean,
    size: string,
    handleClose: any,
    isShowHeader?: boolean,
    className?: React.CSSProperties['className'],
}

export default function Modal({ title, children, isDismissible = false, show, size = "md", handleClose, isShowHeader = true, className = '' }: IModal) {

    return (
        <div className={className}>
            <ModalComponent
                show={show}
                size={size}
                position="center"
                onClose={handleClose}
                dismissible={isDismissible ? isDismissible : false}
            >
                {isShowHeader &&
                    <ModalComponent.Header>
                        {title}
                    </ModalComponent.Header>
                }
                <ModalComponent.Body>
                    {children}
                </ModalComponent.Body>
            </ModalComponent>
        </div>
    )
}