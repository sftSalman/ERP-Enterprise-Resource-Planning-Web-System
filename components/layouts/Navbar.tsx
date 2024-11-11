import { Dropdown } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import { handleSidebar } from "@/redux/actions/global-action";
import { RootState } from "@/redux/store";
import { getAuthData, logout } from "@/utils/auth";

export default function Navbar() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isOpenSidebar } = useSelector((state: RootState) => state.global);
    const userData = getAuthData();

    return (
        <div className="bg-blue-100 border-b border-blue-200 fixed z-30 w-full">
            <div className="px-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <button onClick={() => dispatch(handleSidebar(isOpenSidebar))} id="toggleSidebarMobile" aria-expanded="true" aria-controls="sidebar" className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded">
                            <svg id="toggleSidebarMobileHamburger" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            <svg id="toggleSidebarMobileClose" className="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                        <a href="" className="text-xl font-bold flex items-center lg:ml-2.5">
                            <Image src={'/banner.png'} alt={''} height={80} width={110} unoptimized />
                        </a>
                        {/* <form action="#" method="GET" className="hidden lg:block lg:pl-32">
                            <label htmlFor="topbar-search" className="sr-only">Search</label>
                            <div className="mt-1 relative lg:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                </div>
                                <input type="text" name="email" id="topbar-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full pl-10 p-2.5" placeholder="Search" />
                            </div>
                        </form> */}
                    </div>


                    {
                        typeof userData !== "undefined" && userData !== null &&
                        <Dropdown label={userData.first_name + ' ' + userData.last_name} style={{ backgroundColor: "#0000CD" }}>
                            <Dropdown.Header className="border-gray-300 py-2 text-center">
                                {
                                    userData.avatar === null ?
                                        <span><i className="bi bi-person-bounding-box text-4xl"></i></span> :
                                        // <Image src={userData.avatar} alt={userData.first_name} height={20} width={20} />
                                        <img src='' alt={userData.first_name} className="h-50 w-50" />
                                }
                                <span className="block truncate text-sm font-medium">
                                    {userData.email}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item className="py-2 px-4" onClick={() => router.push('/profile')}>
                                <Link href={'/profile'}>
                                    <i className="bi bi-person-bounding-box"></i> &nbsp;&nbsp; Profile
                                </Link>
                            </Dropdown.Item>
                            {/* <Dropdown.Divider className="" /> */}
                            <Dropdown.Item className="px-4" onClick={() => logout()}>
                                <i className="bi bi-box-arrow-right"></i> &nbsp;&nbsp; Sign out
                            </Dropdown.Item>
                        </Dropdown>
                    }

                </div>
            </div>
        </div>
    )
}
