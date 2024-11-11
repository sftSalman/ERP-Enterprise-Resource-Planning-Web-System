interface ILoading {
    prefix?: string,
    loadingTitle?: string;
    size?: string;
    color?: string;
}

export default function Loading({ prefix = "Loading", loadingTitle = "content", size = "md" }: ILoading) {
    return (
        <div className="spinner">
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <span className="m-5 text-gray-900">
                 {prefix} {loadingTitle}...
             </span>
        </div>

    )
}