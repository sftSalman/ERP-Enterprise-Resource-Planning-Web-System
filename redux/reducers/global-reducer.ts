import { IGlobal } from "../interfaces";
import * as Types from "./../types/global-type";

const initialState: IGlobal = {
    isOpenSidebar: false,
    sideMenuList: []
};

function globalReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.OPEN_SIDEBAR:
            return {
                ...state,
                isOpenSidebar: action.payload,
            };
        case Types.SIDEBAR_MENU_LIST:
            return {
                ...state,
                // sideMenuList: menuList(),
                sideMenuList: action.payload,
            };
        default:
            break;
    }
    return state;
}

function menuList() {
    // Generate and return your menu list array here
    return [
      { id: 1, title: 'Dashboard', url: '/dashboard',submenu:[],icon:'bi-person' },
      { id: 2, title: 'Products', url: '/products',submenu:[],icon:'bi-person' },
      { id: 3, title: 'Orders', url: '/orders',submenu:[],icon:'bi-person' },
      // Add more menu items as needed
    ];
  }

export default globalReducer;
