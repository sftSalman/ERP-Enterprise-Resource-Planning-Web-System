import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import Link from "next/link";

import { getSidebarMenuList } from "@/redux/actions/global-action";
import { RootState } from "@/redux/store";
import { debounce } from "lodash";

function Sidebar() {
    const dispatch: Dispatch = useDispatch();
    const { isOpenSidebar, sideMenuList } = useSelector((state: RootState) => state.global);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
console.log('sideMenuList', sideMenuList)
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const debouncedDispatch = useCallback(
        debounce(() => {
            dispatch(getSidebarMenuList());
        }, 500),
        []
    );

    useEffect(() => {
        if (sideMenuList.length === 0) {
            debouncedDispatch();

            return debouncedDispatch.cancel;
        }
    }, [debouncedDispatch, sideMenuList]);


    return (
        <aside id="sidebar" className={`fixed z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col transition-width ease-in-out duration-300 ${isOpenSidebar || windowWidth > 1023 ? "w-64" : "w-0"}`} aria-label="Sidebar">
            <div className="relative flex-1 flex flex-col h-full min-h-0 border-r border-gray-200 bg-white pt-0">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex-1 px-3 bg-white divide-y space-y-1">
                        <ul className="space-y-2 pb-2 bg-blue-200">
                            {
                                sideMenuList && sideMenuList.length > 0 && sideMenuList.map((menu, menuIndex) => (
                                    <SubMenuUI menu={menu} key={menuIndex + 1} />
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    )
}

const SubMenuUI = ({ menu }) => {
    const router = useRouter();
    const [toggleSubMenu, setToggleSubMenu] = useState(false);
    const { sideMenuList } = useSelector((state: RootState) => state.global);
    const [menuID, setMenuID] = useState(sideMenuList[0].id);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleToggle = (key) => {
        setToggleSubMenu(!toggleSubMenu);
        setMenuID(key.id);
        setIsMenuOpen(!isMenuOpen);
    }

    const getAllUrlsByMenu = (menu) => {
        let urls = [];

        // Get the URL of the main menu item, if there is one
        if (menu.url) {
            urls.push(menu.url);
        }

        // Get the URL of each sub-menu item, if there are any
        if (menu.submenu) {
            for (let subMenu of menu.submenu) {
                urls = urls.concat(getAllUrlsByMenu(subMenu));
            }
        }

        return urls;
    }

    useEffect(() => {
        const subMenuUrls = getAllUrlsByMenu(menu);
        if (subMenuUrls.includes(router.pathname)) {
            setIsMenuOpen(true);
        }
    }, [router.pathname]);

    return (
        <li>
            <button onClick={() => handleToggle(menu)} type="button" className={`text-base text-black-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group w-full ${(menuID === menu.id && toggleSubMenu === true) ? 'bg-blue-100' : 'bg-blue-200'}`}>
                <i className={menu.icon}></i>
                <span className="text-left ml-3 whitespace-nowrap w-full text-sm">{menu.title}</span>
                {
                    !toggleSubMenu ? <i className="bi bi-chevron-down text-sm ml-2" /> :
                        <i className="bi bi-chevron-up text-sm ml-2" />
                }
            </button>
            {
                <ul className={`text-base text-gray-900 font-normal rounded-lg p-2 group w-full ml-2 ${isMenuOpen ? 'block' : 'hidden'}`}>
                    {
                        menu.submenu.map((subMenu, subMenuIndex) => (
                            <div key={subMenuIndex}>
                                {
                                    subMenu.submenu.length === 0 ?
                                        <li className="w-full" key={subMenuIndex + 1}>
                                            <Link href={subMenu.url} className="block transition hover:bg-gray-100 text-gray-900 font-normal text-sm p-2 rounded flex-1 ">
                                                <i className={subMenu.icon}></i> &nbsp;&nbsp;
                                                <span>{subMenu.title}</span>
                                            </Link>
                                        </li> :
                                        <SubSubMenuUI subMenu={subMenu} key={subMenuIndex + 1} />
                                }
                            </div>
                        )
                        )}
                </ul>
            }
        </li>
    )
}

const SubSubMenuUI = ({ subMenu }) => {
    const [isToggleSubSubMenu, setIsToggleSubSubMenu] = useState(false)
    return (
        <li className="w-full">
            <span className="block transition hover:bg-gray-100 text-gray-900 font-normal text-sm p-2 rounded flex-1" onClick={() => setIsToggleSubSubMenu(!isToggleSubSubMenu)}>{subMenu.title}</span>
            <ul className={isToggleSubSubMenu ? 'block' : 'hidden'} >
                {
                    subMenu.submenu.map((subSubMenu, subSubMenuIndex) => (
                        <li className="w-full" key={subSubMenuIndex + 1}>
                            <Link href={subSubMenu.url} className="ml-3 block transition hover:bg-gray-100 text-gray-900 font-normal text-sm p-2 rounded flex-1">
                                <span>{subSubMenu.title}</span>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </li>
    )
}

export default memo(Sidebar);
