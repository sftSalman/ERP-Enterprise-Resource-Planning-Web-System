import { generateDropdownList } from "@/utils/dropdown";
import { IDepartmentReducer } from "@/redux/interfaces";
import * as Types from "@/redux/types/department-type";

const initialState: IDepartmentReducer = {
    isLoading: false,
    isDeleting: false,
    isLoadingDetails: false,
    isSubmitting: false,
    departmentList: [],
    departmentDropdownList: [],
    departmentPaginationData: [],
    departmentDetails: {},
    departmentInput: {
        name: '',
        code: '',
    }
};


function departmentReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.CHANGE_INPUT_VALUE:
            const departmentInput = { ...state.departmentInput };
            departmentInput[action.payload.name] = action.payload.value;
            return {
                ...state,
                departmentInput,
            };
        case Types.EMPTY_DEPARTMENT_INPUT:
            return {
                ...state,
                departmentInput: initialState.departmentInput
            }
        case Types.CREATE_DEPARTMENT:
            if (action.payload.status === true) {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    departmentInput: initialState.departmentInput,
                };
            } else {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                };
            }

        case Types.UPDATE_DEPARTMENT:
            if (!action.payload.status || action.payload.pageType === 'profile') {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    departmentInput: initialState.departmentInput,
                };
            }

            if (action.payload.status) {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    departmentInput: initialState.departmentInput
                };
            }

        case Types.GET_DEPARTMENT_LIST:
            return {
                ...state,
                isLoading: action.payload.isLoading,
                departmentList: action.payload.data,
                departmentPaginationData: action.payload.paginationData,
            };

        case Types.GET_DEPARTMENT_DETAILS:
            return {
                ...state,
                isLoadingDetails: action.payload.isLoading,
                departmentDetails: action.payload.data,
                departmentInput: action.payload.data,
            };
        case Types.DELETE_DEPARTMENT:
            return {
                ...state,
                isDeleting: action.payload.isLoading,
            };

        case Types.GET_DEPARTMENT_DROPDOWN:
            return {
                ...state,
                departmentDropdownList: generateDropdownList(action.payload),
            };
        default:
            break;
    }
    return state;
}
export default departmentReducer;

