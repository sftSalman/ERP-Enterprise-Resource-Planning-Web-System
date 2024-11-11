import axios from "@/utils/axios";
import * as Types from "../types/department-type";
import { Toaster } from "@/components/toaster";
import { Dispatch } from "@reduxjs/toolkit";

export const changeInputValue = (name: string, value: any, e: any) => (dispatch: Dispatch) => {
    let data = {
        name: name,
        value: value,
    }
    dispatch({ type: Types.CHANGE_INPUT_VALUE, payload: data });
};
			
export const emptyDepartmentInputAction = () => (dispatch: Dispatch) => {
    dispatch({ type: Types.EMPTY_DEPARTMENT_INPUT, payload: {} });
};

export const validateDepartmentForm = (departmentInput) => {
    if (departmentInput.name === "") {
        Toaster("error", "Please give department name.");
        return false;
    }

    return true;
}

export const createDepartment = (departmentInput, router) => (dispatch: Dispatch) => {
    if (!validateDepartmentForm(departmentInput)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: false,
    };
    dispatch({ type: Types.CREATE_DEPARTMENT, payload: response });

    axios.post(`/departments`, departmentInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            router.push('/department');
            dispatch({ type: Types.CREATE_DEPARTMENT, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.CREATE_DEPARTMENT, payload: response });
        });
}

export const getDepartmentListAction = (currentPage: number = 1, dataLimit: number = 10, searchText: string = '') => (dispatch: Dispatch) => {
    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: [],
        paginationData: [],
    };
    dispatch({ type: Types.GET_DEPARTMENT_LIST, payload: response });

    const resourceUrl ='departments';

    axios.get(`/${resourceUrl}?perPage=${dataLimit}&page=${currentPage}&search=${searchText}`)
        .then((res) => {
            console.log('res', res)
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data.data;
            response.paginationData = res.data;
            dispatch({ type: Types.GET_DEPARTMENT_LIST, payload: response });
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_DEPARTMENT_LIST, payload: response })
        })

}

export const getDepartmentDetails = (id: number | string) => (dispatch: Dispatch) => {
    if (isNaN(id)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: {},
    };
    dispatch({ type: Types.GET_DEPARTMENT_DETAILS, payload: response });

    axios(`/departments/${id}`)
        .then((res) => {
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            dispatch({ type: Types.GET_DEPARTMENT_DETAILS, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_DEPARTMENT_DETAILS, payload: response });
        });
}


export const deleteDepartment = (id: number | string, setShowDeleteModal: any, isAgent: boolean = false) => (dispatch: Dispatch) => {
    let responseData = {
        status: false,
        message: "",
        isLoading: true,
    };
    dispatch({ type: Types.DELETE_DEPARTMENT, payload: responseData });

    axios.delete(`/departments/${id}`)
        .then((res) => {
            responseData.isLoading = false;
            responseData.status = true;
            responseData.message = res.message;
            Toaster('success', responseData.message);
            setShowDeleteModal(false);
            dispatch(getDepartmentListAction(1, 10, ""));
            dispatch({ type: Types.DELETE_DEPARTMENT, payload: responseData });
        })
        .catch((error) => {
            responseData.isLoading = false;
            dispatch({ type: Types.DELETE_DEPARTMENT, payload: responseData });
        });
}


export const updateDepartment = (departmentInput:any, router: any, pageType: string = 'edit') => (dispatch: Dispatch) => {
    if (!validateDepartmentForm(departmentInput)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        pageType,
    };
    dispatch({ type: Types.UPDATE_DEPARTMENT, payload: response });

    axios.put(`/departments/${departmentInput.id}`, departmentInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            router.push('/department');
            dispatch({ type: Types.UPDATE_DEPARTMENT, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.UPDATE_DEPARTMENT, payload: response });
        });
}

export const getDepartmentDropdownList = () => (dispatch: Dispatch) => {
    axios.get(`/departments/dropdown/list`)
        .then((res) => {
            dispatch({ type: Types.GET_DEPARTMENT_DROPDOWN, payload: res.data });
        });
}