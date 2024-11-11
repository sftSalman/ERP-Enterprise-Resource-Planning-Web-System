interface IPageTitle {
    title?: string;
}

export default function PageTitle({ title = "Page Title" }: IPageTitle) {
    return (
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 capitalize">{title}</h1>
    )
}