import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/pageTitle';
import { getAppName } from '@/utils/app-variables';
import Head from 'next/head';

export interface IPageHeaderProps {
    title: string;
    hasSearch?: boolean;
    searchText?: string;
    onSearchText?: (searchText: string) => void;
    searchPlaceholder?: string;
    headerRightSide?: React.ReactNode;
    pageTitleRightSide?: React.ReactNode;
}

export default function PageHeader({
    title,
    hasSearch = true,
    searchText = '',
    searchPlaceholder = '',
    onSearchText = (searchText) => { },
    headerRightSide = <></>,
    pageTitleRightSide = <></>
}: IPageHeaderProps) {
    return (
        <div className="p-4 bg-white block sm:flex items-center justify-between lg:mt-1.5">
            <div className="mb-1 w-full">
                <div>
                    <Breadcrumb />
                    <div className="flex justify-between">
                        <PageTitle title={title} />
                        {pageTitleRightSide}
                    </div>
                    <Head>
                        <title>{title} | {getAppName()}</title>
                    </Head>
                </div>
                <div className="flex mt-3 justify-between">
                    <div className="sm:flex flex-1 items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                        {
                            hasSearch &&
                            <form className="lg:pr-3" action="#" method="GET">
                                <label htmlFor="users-search" className="sr-only">Search</label>
                                <div className="mt-1 relative lg:w-64 xl:w-96">
                                    <input
                                        type="text"
                                        name="bank"
                                        id="bank-search"
                                        value={searchText}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        placeholder={searchPlaceholder}
                                        onChange={(e) => onSearchText(e.target.value)}
                                    />
                                </div>
                            </form>
                        }
                    </div>
                    <div className="flex flex-1 ml-2 sm:ml-auto justify-end space-x-2 sm:space-x-3">
                        {headerRightSide}
                    </div>
                </div>
            </div>
        </div>
    );
}
