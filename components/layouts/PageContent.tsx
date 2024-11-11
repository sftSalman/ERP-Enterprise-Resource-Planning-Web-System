export interface IPageContentProps {
    children: React.ReactNode;
    hasShadow?: boolean;
}

export function PageContent({ children, hasShadow = true }: IPageContentProps) {
    return (
        <div className="px-5">
            <div className={`my-3 p-4 rounded-md ${hasShadow ? 'shadow-md' : ''} bg-white`}>
                {children}
            </div>
        </div>
    );
}
