import axios from "@/utils/axios";
import * as Types from "../types/designation-type";
import { Toaster } from "@/components/toaster";
import { Dispatch } from '@reduxjs/toolkit';

export const changeInputValue = (name: string, value: any) => (dispatch: any) => {
    let data = {
        name: name,
        value: value,
    }
    dispatch({ type: Types.CHANGE_INPUT_VALUE, payload: data });
};

export const emptyDesignationInputAction = () => (dispatch: Dispatch) => {
    dispatch({ type: Types.EMPTY_DESIGNATION_INPUT, payload: {} });
};


export const submitDesignationAction = (productInput: any, closeModal: any) => (dispatch: Dispatch) => {

    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: {},
    };
    dispatch({ type: Types.SUBMIT_DESIGNATION, payload: response });

    axios.post(`/designations`, productInput)
        .then((res) => {
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            dispatch({ type: Types.SUBMIT_DESIGNATION, payload: response });
            Toaster('success', response.message);
            dispatch(getDesignationListAction())
            closeModal(false);
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.SUBMIT_DESIGNATION, payload: response })
        });
}

export const getDesignationListAction = (currentPage: number = 1, dataLimit: number = 10, searchText = '') => (dispatch: Dispatch) => {
    let url = `designations?perPage=${dataLimit}&page=${currentPage}`

    if (searchText !== '') {
        url += `&search=${searchText}`;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: [],
        paginationData: [],
    };
    dispatch({ type: Types.GET_DESIGNATION_LIST, payload: response });

    axios.get(url)
        .then((res) => {
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data.data;
            response.paginationData = res.data;
            dispatch({ type: Types.GET_DESIGNATION_LIST, payload: response });
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_DESIGNATION_LIST, payload: response })
        })
}


export const getDesignationDetailsAction = (id: number | string) => (dispatch: Dispatch) => {
    if (isNaN(parseInt(id + ''))) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: null,
        inputData: {},
    };
    dispatch({ type: Types.GET_DESIGNATION_DETAILS, payload: response });

    axios.get(`/designations/${parseInt(id + '')}`)
        .then(res => {
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            dispatch({ type: Types.GET_DESIGNATION_DETAILS, payload: response });
        })
        .catch(error => {
            response.isLoading = false;
            dispatch({ type: Types.GET_DESIGNATION_DETAILS, payload: response });
        });
}

export const updateDesignationAction = (productInput: any, id: number, closeModal: any) => (dispatch: Dispatch) => {
    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: {},
    };
    dispatch({ type: Types.UPDATE_DESIGNATION, payload: response });

    axios.put(`/designations/${id}`, productInput)
        .then((res) => {
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            dispatch({ type: Types.UPDATE_DESIGNATION, payload: response });
            Toaster('success', response.message);
            dispatch(getDesignationListAction())
            closeModal(false);
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.UPDATE_DESIGNATION, payload: response })
        });
}

export const deleteDesignationAction = (id: any, setShowDeleteModal: any) => (dispatch: Dispatch) => {
    let responseData = {
        status: false,
        message: "",
        isLoading: true,
    };
    dispatch({ type: Types.DELETE_DESIGNATION, payload: responseData });

    axios.delete(`/designations/${id}`)
        .then(res => {
            responseData.isLoading = false;
            responseData.status = true;
            responseData.message = res.message;
            Toaster('success', responseData.message);
            setShowDeleteModal(false);
            dispatch(getDesignationListAction());
            dispatch({ type: Types.DELETE_DESIGNATION, payload: responseData });
        })
        .catch(error => {
            responseData.isLoading = false;
            dispatch({ type: Types.DELETE_DESIGNATION, payload: responseData })
        });
}


export const getDesignationDropdownList = () => (dispatch: Dispatch) => {
    axios.get(`/designations/dropdown/list`)
        .then((res) => {
            dispatch({ type: Types.GET_DESIGNATION_DROPDOWN, payload: res.data });
        })
}