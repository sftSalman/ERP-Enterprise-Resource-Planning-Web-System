import { generateDropdownList } from "@/utils/dropdown";
import { ICityReducer } from "@/redux/interfaces";
import * as Types from "@/redux/types/city-type";

const initialState: ICityReducer = {
    isLoading: false,
    cities: [],
    nomineeDefaultCities: [],
};

export default function CityReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.GET_CITY_DROPDOWN:
            return {
                ...state,
                isLoading: action.payload.loading,
                cities: generateDropdownList(action.payload.data),
            };

        case Types.SET_NOMINEE_DEFAULT_CITY_DROPDOWN:
            return {
                ...state,
                nomineeDefaultCities: action.payload,
            };

        default:
            break;
    }
    return state;
}
