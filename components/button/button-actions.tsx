import { Dropdown } from "flowbite-react";

interface IActionButtonItem {
    onClick: () => void;
    element: React.ReactNode | string;
    iconClass?: string;
}

interface IActionButtons {
    items: Array<IActionButtonItem>
}

export default function ActionButtons({ items }: IActionButtons) {
    return (
        <Dropdown
            label={
                <div className='mt-2'>
                    <i className="bi bi-three-dots-vertical hover:text-blue-500"></i>
                </div>
            }
            inline={true}
            arrowIcon={false}
        >
            {
                items.map((item, index) => (
                    <Dropdown.Item onClick={item.onClick} key={index}>
                        {
                            item.iconClass !== undefined && item.iconClass !== '' &&
                            <i className={`bi bi-${item.iconClass} mr-4`}></i>
                        }
                        {item.element}
                    </Dropdown.Item>
                ))
            }
        </Dropdown>
    )
}