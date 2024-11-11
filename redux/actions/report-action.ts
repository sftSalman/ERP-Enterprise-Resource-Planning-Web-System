import axios from "@/utils/axios";
import * as Types from "../types/report-type";
import { Toaster } from "@/components/toaster";
import { Dispatch } from "@reduxjs/toolkit";


export const getSellerPolicyReportListAction = (currentPage: number = 1, dataLimit: number = 10, searchText: string = '', isAgent: boolean = false) => (dispatch: Dispatch) => {
    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: [],
        paginationData: [],
    };
    dispatch({ type: Types.GET_SELLER_POLICY_LIST, payload: response });

    axios.get(`/seller-policy-report?perPage=${dataLimit}&page=${currentPage}&search=${searchText}`)
        .then((res) => {
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data.data;
            response.paginationData = res.data;
            dispatch({ type: Types.GET_SELLER_POLICY_LIST, payload: response });
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_SELLER_POLICY_LIST, payload: response })
        })

}

export const getEmployeeDetails = (id: number | string, isAgent: boolean = false) => (dispatch: Dispatch) => {
    if (isNaN(id)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: {},
    };
    dispatch({ type: Types.GET_SELLER_POLICY_DETAILS, payload: response });

    axios(`/${isAgent ? 'agents' : 'employees'}/${id}`)
        .then((res) => {
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            const branches = res.data.branches;
            const branchIds = [];
            branches.forEach(branch => {
                branchIds.push({
                    label: branch.branch_name,
                    value: branch.branch_id,
                })
            });
            response.data.branch_ids = branchIds;
            dispatch({ type: Types.GET_SELLER_POLICY_DETAILS, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_SELLER_POLICY_DETAILS, payload: response });
        });
}


export const deleteEmployee = (id: number | string, setShowDeleteModal: any, isAgent: boolean = false) => (dispatch: Dispatch) => {
    let responseData = {
        status: false,
        message: "",
        isLoading: true,
    };
    dispatch({ type: Types.DELETE_EMPLOYEE, payload: responseData });

    axios.delete(`/${isAgent ? 'agents' : 'employees'}/${id}`)
        .then((res) => {
            responseData.isLoading = false;
            responseData.status = true;
            responseData.message = res.message;
            Toaster('success', responseData.message);
            setShowDeleteModal(false);
            dispatch(getEmployeeListAction(1, 10, "", isAgent));
            dispatch({ type: Types.DELETE_EMPLOYEE, payload: responseData });
        })
        .catch((error) => {
            responseData.isLoading = false;
            dispatch({ type: Types.DELETE_EMPLOYEE, payload: responseData });
        });
}


export const updateEmployee = (employeeInput, router: any, pageType: string = 'edit', isAgent: boolean = false) => (dispatch: Dispatch) => {
    if (!validateEmployeeForm(employeeInput)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        pageType,
    };
    dispatch({ type: Types.UPDATE_EMPLOYEE, payload: response });

    axios.put(`/${isAgent ? 'agents' : 'employees'}/${employeeInput.id}`, employeeInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            if (pageType !== 'profile') {
                router.push(isAgent ? '/banca/agent' : '/employee');
            }
            dispatch({ type: Types.UPDATE_EMPLOYEE, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.UPDATE_EMPLOYEE, payload: response });
        });
}

export const getEmployeeRolesDropdownList = (isAgent: boolean = false) => (dispatch: Dispatch) => {
    axios.get(`/roles/dropdown/list?is_head_office=${isAgent ? 0 : 1}`)
        .then((res) => {
            dispatch({ type: Types.GET_EMPLOYEE_ROLES, payload: res.data });
        })
}

export const getAgentsDropdownList = () => (dispatch: Dispatch) => {
    axios.get(`/agents/bank-executive/list`)
        .then((res) => {
            dispatch({ type: Types.GET_AGENT_DROPDOWN_LIST, payload: res.data });
        })
}