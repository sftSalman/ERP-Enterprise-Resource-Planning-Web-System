import { generateDropdownList } from "@/utils/dropdown";
import { IEmployeeReducer } from "@/redux/interfaces";
import * as Types from "@/redux/types/employee-type";

const initialState: IEmployeeReducer = {
    isLoading: false,
    isDeleting: false,
    isLoadingDetails: false,
    isSubmitting: false,
    employeeList: [],
    employeeChart: [],
    employeePaginationData: [],
    employeeDetails: {},
    rolesDropdownList: [],
    agentsDropdownList: [],
    managerDropdownList: [],
    employeeInput: {
        first_name: '',
        last_name: '',
        email: '',
        designation_id: 0,
        role_id: 0,
        project_id: 0,
        department_ids: [],
        phone: '',
        avatar: null,
        password: 'admin@123',
        confirm_password: '',
    }
};


function employeeReducer(state = initialState, action: any) {
    switch (action.type) {
        case Types.CHANGE_INPUT_VALUE:
            const employeeInput = { ...state.employeeInput };
            employeeInput[action.payload.name] = action.payload.value;
            return {
                ...state,
                employeeInput,
            };
        case Types.EMPTY_EMPLOYEE_INPUT:
            return {
                ...state,
                employeeInput: initialState.employeeInput
            }
        case Types.CREATE_EMPLOYEE:
            if (action.payload.status === true) {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                    employeeInput: initialState.employeeInput,
                };
            } else {
                return {
                    ...state,
                    isSubmitting: action.payload.isLoading,
                };
            }

        case Types.UPDATE_EMPLOYEE:
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
                    employeeInput: initialState.employeeInput
                };
            }

        case Types.GET_EMPLOYEE_LIST:
            return {
                ...state,
                isLoading: action.payload.isLoading,
                employeeList: action.payload.data,
                employeePaginationData: action.payload.paginationData,
            };

            case Types.GET_EMPLOYEE_CHART:
            return {
                ...state,
                isLoading: action.payload.isLoading,
                employeeChart: action.payload.data
            };

        case Types.GET_EMPLOYEE_DETAILS:
            return {
                ...state,
                isLoadingDetails: action.payload.isLoading,
                employeeDetails: action.payload.data,
                employeeInput: action.payload.data,
            };
        case Types.DELETE_EMPLOYEE:
            return {
                ...state,
                isDeleting: action.payload.isLoading,
            };
        case Types.GET_EMPLOYEE_ROLES:
            return {
                ...state,
                rolesDropdownList: generateDropdownList(action.payload),
            };

        case Types.GET_AGENT_DROPDOWN_LIST:
            return {
                ...state,
                agentsDropdownList: generateDropdownList(action.payload),
            };
        case Types.GET_MANAGER_DROPDOWN:
            return {
                ...state,
                managerDropdownList: generateDropdownList(action.payload),
            };
        default:
            break;
    }
    return state;
}
export default employeeReducer;

