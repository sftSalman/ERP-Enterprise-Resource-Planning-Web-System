import { Spinner } from "flowbite-react";

interface ILoading {
    prefix?: string,
    loadingTitle?: string;
    size?: string;
    color?: string;
}

export default function InlineLoading({ prefix = "Loading", loadingTitle = "content", size = "sm" }: ILoading) {
    return (
        <div className="my-2">
            <Spinner
                aria-label="Spinner button example"
                size={size}
                color='success'
            />
            <span className="pl-3 text-gray-900 text-sm italic">
                {prefix} {loadingTitle}...
            </span>
        </div>
    )
}