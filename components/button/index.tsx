interface IButton {
    title?: string;
    name?: string;
    loadingTitle?: string;
    onClick?: React.SyntheticEvent | any;
    disabled?: boolean;
    loading?: boolean;
    position?: string;
    type?: 'submit' | 'button' | 'reset';
    customClass?: string;
    children?: React.ReactNode;
    variant?: 'primary' | 'default' | 'danger' | 'success';
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export default function Button({
    title,
    name,
    loadingTitle = "Loading...",
    onClick = () => { },
    disabled = false,
    loading = false,
    type = "submit",
    position = "text-right",
    children,
    customClass = "",
    variant = 'primary',
    iconLeft = <></>,
    iconRight = <></>,
}: IButton) {

    return (
        <div className={position}>
            <button
                className={
                    `${variant === 'default' ? 'text-black' : 'text-white'} 
                    transition 
                    ${variant === 'primary' ? 'bg-cyan-600' : ''} 
                    ${variant === 'danger' ? 'bg-red-600' : ''} 
                    ${variant === 'default' ? 'bg-slate-200' : ''} 
                    ${variant === 'success' ? 'bg-green-500' : ''} 
                    focus:ring-4 
                    focus:ring-cyan-200 
                    font-medium rounded-lg text-sm text-center 
                    ${loading ? 'animate-pulse' : ''} 
                    leading-none 
                    px-5 
                    py-2.5 
                    hover:opacity-80 
                    ${customClass}`
                }
                name={name}
                type={type}
                disabled={loading || disabled}
                onClick={onClick}
            >
                {iconLeft}
                {loading ? loadingTitle + '...' : ''}
                {(!loading && typeof title !== "undefined" && title !== null) ? title : children}
                {iconRight}
            </button>
        </div>
    );
};
