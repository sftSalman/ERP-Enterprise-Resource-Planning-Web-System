interface IStatusBadge {
    status: string;
    className?: React.CSSProperties['className'];
    left?: React.ReactNode;
    right?: React.ReactNode;
}

export default function StatusBadge({ status = '', className, left = <></>, right = <></> }: IStatusBadge) {
    let colorClass, label;

    switch (status) {
        case 'pending':
            colorClass = 'bg-yellow-200 text-yellow-700';
            break;
        case 'approved':
            colorClass = 'bg-green-200 text-green-700';
            break;
        case 'completed':
            colorClass = 'bg-green-500 text-white';
            break;
        case 'rejected':
            colorClass = 'bg-red-200 text-red-700';;
            break;
        case 'expired':
            colorClass = 'bg-gray-200 text-gray-700';
            break;
        case 'processing':
            colorClass = 'bg-blue-200 text-blue-700';
            break;
        case 'submitted':
            colorClass = 'bg-purple-200 text-purple-700';
            break;
        default:
            colorClass = 'bg-slate-100 text-slate-700';
            break;
    }

    label = status.toUpperCase();

    return (
        <div className={`inline-block px-3 py-1 rounded text-xs ${colorClass} ${className}`}>
            {left}
            {label}
            {right}
        </div>
    );
}