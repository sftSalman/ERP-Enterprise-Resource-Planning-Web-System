import { generateDropdownList } from "@/utils/dropdown";
import { IChildDivisionReducer } from "@/redux/interfaces";
import * as Types from "@/redux/types/child-division-type";

const initialState: IChildDivisionReducer = {
    isLoading: false,
    isDeleting: false,
    isLoadingDetails: false,
    isSubmitting: false,
    childDivisionList: [],
    childDivisionDropdownList: [],
    childDivisionPaginationData: [],
    childDivisionDetails: {},
    childDivisionInput: {
        name: '',
        code: '',
        sub_division_id:0,
    }
};


function childDivisionReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.CHANGE_INPUT_VALUE:
            const childDivisionInput = { ...state.childDivisionInput };
            childDivisionInput[action.payload.name] = action.payload.value;
            return {
                ...state,
                childDivisionInput,
            };
        case Types.EMPTY_CHILD_DIVISION_INPUT:
            return {
                ...state,
                childDivisionInput: initialState.childDivisionInput
            }
        case Types.CREATE_CHILD_DIVISION:
            if (action.payload.status === true) {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    childDivisionInput: initialState.childDivisionInput,
                };
            } else {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                };
            }

        case Types.UPDATE_CHILD_DIVISION:
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
                    childDivisionInput: initialState.childDivisionInput
                };
            }

        case Types.GET_CHILD_DIVISION_LIST:
            return {
                ...state,
                isLoading: action.payload.isLoading,
                childDivisionList: action.payload.data,
                divisiontPaginationData: action.payload.paginationData,
            };

        case Types.GET_CHILD_DIVISION_DETAILS:
            return {
                ...state,
                isLoadingDetails: action.payload.isLoading,
                childDivisionDetails: action.payload.data,
                childDivisionInput: action.payload.data,
            };
        case Types.DELETE_DIVISION:
            return {
                ...state,
                isDeleting: action.payload.isLoading,
            };

        case Types.GET_CHILD_DIVISION_DROPDOWN:
            return {
                ...state,
                childDivisionDropdownList: generateDropdownList(action.payload),
            };
        default:
            break;
    }
    return state;
}
export default childDivisionReducer;

