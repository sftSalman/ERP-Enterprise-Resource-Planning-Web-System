
import { Pagination } from "flowbite-react";

interface ITable {
    column?: any[];
    children?: React.ReactNode;
    currentPage?: number;
    setCurrentPage?: any;
    dataLimit?: number;
    totalData?: number;
}

export default function Table({ column, children, currentPage = 1, setCurrentPage, dataLimit = 10, totalData = 1 }: ITable) {

    let totalPages = 1;

    if (typeof totalData !== 'undefined' && totalData > 0) {
        const countPage = (totalData / dataLimit);
        totalPages = Math.ceil(countPage);
    }

    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 divide-y divide-gray-200 table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-blue-100">
                    <tr className=''>
                        {
                            column && column.length > 0 && column.map((data, index) => (
                                <th scope="col" className={`px-3 py-3 text-left`} key={index + 1}>
                                    {data.title}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody className="capitalize">
                    {
                        children
                    }
                </tbody>
            </table>
            {
                totalData > dataLimit &&
                <div className="text-center py-3">
                    <Pagination
                        currentPage={currentPage}
                        layout="pagination"
                        showIcons={true}
                        totalPages={totalPages}
                        previousLabel="Previous"
                        nextLabel="Next"
                        onPageChange={(value) => setCurrentPage(value)}
                        className="custom-pagination"
                    />
                </div>
            }
        </div>
    )
}