import Link from "next/link";

interface INewButton {
    href?: string;
    onClick?: (() => void) | null;
    element: React.ReactNode | string;
    classNames?: string;
}

export default function NewButton({ href = '', element, classNames, onClick = null }: INewButton) {
    return (
        <Link
            href={href === '' ? '#' : href}
            type="button"
            onClick={onClick !== null ? onClick : () => {}}
            className={`w-1/2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto ${classNames}`}
        >
            <i className='bi bi-plus-circle mr-2'></i>
            {element}
        </Link>
    )
}