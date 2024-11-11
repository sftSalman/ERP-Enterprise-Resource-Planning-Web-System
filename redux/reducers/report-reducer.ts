import {IReportReducer } from "@/redux/interfaces";
import * as Types from "@/redux/types/report-type";

const initialState: IReportReducer = {
    isLoading: false,
    isDeleting: false,
    isLoadingDetails: false,
    isSubmitting: false,
    reportList: [],
    reportPaginationData: [],
    reportDetails: {},
};


function reportReducer(state = initialState, action: any) {
    switch (action.type) {

        case Types.GET_SELLER_POLICY_LIST:
            return {
                ...state,
                isLoading: action.payload.isLoading,
                reportList: action.payload.data,
                employeePaginationData: action.payload.paginationData,
            };

        case Types.GET_SELLER_POLICY_DETAILS:
            return {
                ...state,
                isLoadingDetails: action.payload.isLoading,
                employeeDetails: action.payload.data,
            };
        default:
            break;
    }
    return state;
}
export default reportReducer;

