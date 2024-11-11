import { generateDropdownList } from "@/utils/dropdown";
import { ISubDivisionReducer } from "@/redux/interfaces";
import * as Types from "@/redux/types/sub-division-type";

const initialState: ISubDivisionReducer = {
    isLoading: false,
    isDeleting: false,
    isLoadingDetails: false,
    isSubmitting: false,
    subDivisionList: [],
    subDivisionDropdownList: [],
    subDivisionPaginationData: [],
    subDivisionDetails: {},
    subDivisionInput: {
        name: '',
        code: '',
        division_id:0,
    }
};


function subDivisionReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.CHANGE_INPUT_VALUE:
            const subDivisionInput = { ...state.subDivisionInput };
            subDivisionInput[action.payload.name] = action.payload.value;
            return {
                ...state,
                subDivisionInput,
            };
        case Types.EMPTY_SUB_DIVISION_INPUT:
            return {
                ...state,
                subDivisionInput: initialState.subDivisionInput
            }
        case Types.CREATE_SUB_DIVISION:
            if (action.payload.status === true) {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    subDivisionInput: initialState.subDivisionInput,
                };
            } else {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                };
            }

        case Types.UPDATE_SUB_DIVISION:
            if (!action.payload.status || action.payload.pageType === 'profile') {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                };
            }

            if (action.payload.status) {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    subDivisionInput: initialState.subDivisionInput
                };
            }

        case Types.GET_SUB_DIVISION_LIST:
            return {
                ...state,
                isLoading: action.payload.isLoading,
                subDivisionList: action.payload.data,
                divisiontPaginationData: action.payload.paginationData,
            };

        case Types.GET_SUB_DIVISION_DETAILS:
            return {
                ...state,
                isLoadingDetails: action.payload.isLoading,
                subDivisionDetails: action.payload.data,
                subDivisionInput: action.payload.data,
            };
        case Types.DELETE_DIVISION:
            return {
                ...state,
                isDeleting: action.payload.isLoading,
            };

        case Types.GET_SUB_DIVISION_DROPDOWN:
            return {
                ...state,
                subDivisionDropdownList: generateDropdownList(action.payload),
            };
        default:
            break;
    }
    return state;
}
export default subDivisionReducer;

