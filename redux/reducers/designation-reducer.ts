import { generateDropdownList } from "@/utils/dropdown";
import { IDesignation } from "../interfaces";
import * as Types from "./../types/designation-type";

const initialState: IDesignation = {
    isLoading: false,
    isDeleting: false,
    isLoadingDetails: false,
    isSubmitting: false,
    designationDropdownList: [],
    designationList: [],
    paginationData: {},
    designationDetails: {},
    designationInput: {
        name: "",
        code: ""
    },
};


function designationReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.CHANGE_INPUT_VALUE:
            const designationInput = { ...state.designationInput };
            designationInput[action.payload.name] = action.payload.value;
            return {
                ...state,
                designationInput,
            };
        case Types.EMPTY_DESIGNATION_INPUT:
            return {
                ...state,
                designationInput: initialState.designationInput
            }
        case Types.SUBMIT_DESIGNATION:
            return {
                ...state,
                isSubmitting: action.payload.isLoading,
                designationInput: action.payload.status ? initialState.designationInput : state.designationInput
            };
        case Types.GET_DESIGNATION_LIST:
            return {
                ...state,
                designationList: action.payload.data,
                paginationData: action.payload.paginationData,
                isLoading: action.payload.isLoading,
            };
        case Types.GET_DESIGNATION_DETAILS:
            return {
                ...state,
                designationDetails: action.payload.data,
                designationInput: action.payload.data,
                isLoadingDetails: action.payload.isLoading,
            };
        case Types.UPDATE_DESIGNATION:
            return {
                ...state,
                isSubmitting: action.payload.isLoading,
                designationInput: action.payload.status ? initialState.designationInput : state.designationInput
            };
        case Types.DELETE_DESIGNATION:
            return {
                ...state,
                isDeleting: action.payload.isLoading,
            };
        case Types.GET_DESIGNATION_DROPDOWN:
            return {
                ...state,
                designationDropdownList: generateDropdownList(action.payload),
            };
        default:
            break;
    }
    return state;
}

export default designationReducer;
