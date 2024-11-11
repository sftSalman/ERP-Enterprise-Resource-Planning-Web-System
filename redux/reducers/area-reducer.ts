import { generateDropdownList } from "@/utils/dropdown";
import { IAreaReducer } from "@/redux/interfaces";
import * as Types from "@/redux/types/area-type";

const initialState: IAreaReducer = {
    isLoading: false,
    areas: [],
    nomineeDefaultAreas: [],
};

export default function AreaReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.GET_AREA_DROPDOWN:
            return {
                ...state,
                isLoading: action.payload.loading,
                areas: generateDropdownList(action.payload.data),
            };

        case Types.SET_NOMINEE_DEFAULT_AREA_DROPDOWN:
            return {
                ...state,
                nomineeDefaultAreas: action.payload,
            };

        default:
            break;
    }
    return state;
}
