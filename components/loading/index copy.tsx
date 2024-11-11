import { Spinner } from "flowbite-react";

interface ILoading {
    prefix?: string,
    loadingTitle?: string;
    size?: string;
    color?: string;
}

export default function Loading({ prefix = "Loading", loadingTitle = "content", size = "md" }: ILoading) {
    return (
        <div>
            <Spinner
                aria-label="Spinner button example"
                size={size}
                color='success'
            />
            <span className="pl-3 text-gray-900">
                {prefix} {loadingTitle}...
            </span>
        </div>
    )
}