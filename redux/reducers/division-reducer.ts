import { generateDropdownList } from "@/utils/dropdown";
import { IDivisionReducer } from "@/redux/interfaces";
import * as Types from "@/redux/types/division-type";

const initialState: IDivisionReducer = {
    isLoading: false,
    isDeleting: false,
    isLoadingDetails: false,
    isSubmitting: false,
    divisionList: [],
    divisionDropdownList: [],
    divisionPaginationData: [],
    divisionDetails: {},
    divisionInput: {
        name: '',
        code: '',
    }
};


function divisionReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.CHANGE_INPUT_VALUE:
            const divisionInput = { ...state.divisionInput };
            divisionInput[action.payload.name] = action.payload.value;
            return {
                ...state,
                divisionInput,
            };
        case Types.EMPTY_DIVISION_INPUT:
            return {
                ...state,
                divisionInput: initialState.divisionInput
            }
        case Types.CREATE_DIVISION:
            if (action.payload.status === true) {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    divisionInput: initialState.divisionInput,
                };
            } else {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                };
            }

        case Types.UPDATE_DIVISION:
            if (!action.payload.status || action.payload.pageType === 'profile') {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    divisionInput: action.payload.status ? initialState.divisionInput : state.divisionInput
                };
            }

            if (action.payload.status) {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    divisionInput: initialState.divisionInput
                };
            }

        case Types.GET_DIVISION_LIST:
            return {
                ...state,
                isLoading: action.payload.isLoading,
                divisionList: action.payload.data,
                divisiontPaginationData: action.payload.paginationData,
            };

        case Types.GET_DIVISION_DETAILS:
            return {
                ...state,
                isLoadingDetails: action.payload.isLoading,
                divisionDetails: action.payload.data,
                divisionInput: action.payload.data,
            };
        case Types.DELETE_DIVISION:
            return {
                ...state,
                isDeleting: action.payload.isLoading,
            };

        case Types.GET_DIVISION_DROPDOWN:
            return {
                ...state,
                divisionDropdownList: generateDropdownList(action.payload),
            };
        default:
            break;
    }
    return state;
}
export default divisionReducer;

