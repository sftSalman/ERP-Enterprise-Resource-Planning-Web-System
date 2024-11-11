interface INotTableDataFound {
    colSpan: number;
    children: React.ReactNode;
    iconName?: string;
}

export default function NoTableDataFound({ colSpan, children, iconName = 'file-x' }: INotTableDataFound) {
    return (
        <tr className="bg-slate-100 text-gray-500">
            <td colSpan={colSpan} className="p-4">
                <i className={`bi bi-${iconName} mr-2`}></i>
                {children}
            </td>
        </tr>
    )
}