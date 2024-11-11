export interface IPageContentProps {
    children: React.ReactNode;
}

export function PageContentList({ children }: IPageContentProps) {
    return (
        <div className={`my-3 p-4 rounded-md`}>
            {children}
        </div>
    );
}
