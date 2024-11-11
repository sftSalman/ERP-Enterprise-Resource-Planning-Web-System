import axios from "@/utils/axios";
import * as Types from "../types/sub-division-type";
import { Toaster } from "@/components/toaster";
import { Dispatch } from "@reduxjs/toolkit";

export const changeInputValue = (name: string, value: any, e: any) => (dispatch: Dispatch) => {
    let data = {
        name: name,
        value: value,
    }
    dispatch({ type: Types.CHANGE_INPUT_VALUE, payload: data });
};
			
export const emptySubDivisionInputAction = () => (dispatch: Dispatch) => {
    dispatch({ type: Types.EMPTY_SUB_DIVISION_INPUT, payload: {} });
};

export const validateDivisionForm = (subdivisionInput) => {
    if (subdivisionInput.name === "") {
        Toaster("error", "Please give division name.");
        return false;
    }

    return true;
}

export const createSubDivision = (subdivisionInput, router) => (dispatch: Dispatch) => {
    if (!validateDivisionForm(subdivisionInput)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
    };
    dispatch({ type: Types.CREATE_SUB_DIVISION, payload: response });

    axios.post(`/sub-divisions`, subdivisionInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            router.push('/sub-division');
            dispatch({ type: Types.CREATE_SUB_DIVISION, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.CREATE_SUB_DIVISION, payload: response });
        });
}

export const getSubDivisionListAction = (currentPage: number = 1, dataLimit: number = 10, searchText: string = '') => (dispatch: Dispatch) => {
    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: [],
        paginationData: [],
    };
    dispatch({ type: Types.GET_SUB_DIVISION_LIST, payload: response });

    const resourceUrl ='sub-divisions';

    axios.get(`/${resourceUrl}?perPage=${dataLimit}&page=${currentPage}&search=${searchText}`)
        .then((res) => {
            console.log('subdivision', res)
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data.data;
            response.paginationData = res.data;
            dispatch({ type: Types.GET_SUB_DIVISION_LIST, payload: response });
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_SUB_DIVISION_LIST, payload: response })
        })

}

export const getSubDivisionDetails = (id: number) => (dispatch: Dispatch) => {
    if (isNaN(id)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: {},
    };
    dispatch({ type: Types.GET_SUB_DIVISION_DETAILS, payload: response });

    axios(`/sub-divisions/${id}`)
        .then((res) => {
            console.log('division', res)
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            dispatch({ type: Types.GET_SUB_DIVISION_DETAILS, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_SUB_DIVISION_DETAILS, payload: response });
        });
}


export const deleteSubDivision = (id: number | string, setShowDeleteModal: any, isAgent: boolean = false) => (dispatch: Dispatch) => {
    let responseData = {
        status: false,
        message: "",
        isLoading: true,
    };
    dispatch({ type: Types.DELETE_SUB_DIVISION, payload: responseData });

    axios.delete(`/sub-divisions/${id}`)
        .then((res) => {
            responseData.isLoading = false;
            responseData.status = true;
            responseData.message = res.message;
            Toaster('success', responseData.message);
            setShowDeleteModal(false);
            dispatch(getDivisionListAction(1, 10, ""));
            dispatch({ type: Types.DELETE_SUB_DIVISION, payload: responseData });
        })
        .catch((error) => {
            responseData.isLoading = false;
            dispatch({ type: Types.DELETE_SUB_DIVISION, payload: responseData });
        });
}


export const updateSubDivision = (subdivisionInput:any, router: any, pageType: string = 'edit') => (dispatch: Dispatch) => {
    if (!validateDivisionForm(subdivisionInput)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        pageType,
    };
    dispatch({ type: Types.UPDATE_SUB_DIVISION ,payload: response });

    axios.put(`/sub-divisions/${subdivisionInput.id}`, subdivisionInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            router.push('/sub-division');
            dispatch({ type: Types.UPDATE_SUB_DIVISION, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.UPDATE_SUB_DIVISION, payload: response });
        });
}

export const getSubDivisionDropdownList = () => (dispatch: Dispatch) => {
    axios.get(`/sub-divisions/dropdown/list`)
        .then((res) => {
            dispatch({ type: Types.GET_SUB_DIVISION_DROPDOWN, payload: res.data });
        });
}