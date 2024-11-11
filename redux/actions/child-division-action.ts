import axios from "@/utils/axios";
import * as Types from "../types/child-division-type";
import { Toaster } from "@/components/toaster";
import { Dispatch } from "@reduxjs/toolkit";

export const changeInputValue = (name: string, value: any, e: any) => (dispatch: Dispatch) => {
    let data = {
        name: name,
        value: value,
    }
    dispatch({ type: Types.CHANGE_INPUT_VALUE, payload: data });
};
			
export const emptyChildDivisionInputAction = () => (dispatch: Dispatch) => {
    dispatch({ type: Types.EMPTY_CHILD_DIVISION_INPUT, payload: {} });
};

export const validateDivisionForm = (childdivisionInput:any) => {
    if (childdivisionInput.name === "") {
        Toaster("error", "Please give division name.");
        return false;
    }

    return true;
}

export const createChildDivision = (childdivisionInput:any, router) => (dispatch: Dispatch) => {
    if (!validateDivisionForm(childdivisionInput)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
    };
    dispatch({ type: Types.CREATE_CHILD_DIVISION, payload: response });

    axios.post(`/child-divisions`, childdivisionInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            router.push('/child-division');
            dispatch({ type: Types.CREATE_CHILD_DIVISION, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.CREATE_CHILD_DIVISION, payload: response });
        });
}

export const getChildDivisionListAction = (currentPage: number = 1, dataLimit: number = 10, searchText: string = '') => (dispatch: Dispatch) => {
    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: [],
        paginationData: [],
    };
    dispatch({ type: Types.GET_CHILD_DIVISION_LIST, payload: response });

    const resourceUrl ='child-divisions';

    axios.get(`/${resourceUrl}?perPage=${dataLimit}&page=${currentPage}&search=${searchText}`)
        .then((res) => {
            console.log('child', res)
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data.data;
            response.paginationData = res.data;
            dispatch({ type: Types.GET_CHILD_DIVISION_LIST, payload: response });
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_CHILD_DIVISION_LIST, payload: response })
        })

}

export const getChildDivisionDetails = (id: number) => (dispatch: Dispatch) => {
    if (isNaN(id)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: {},
    };
    dispatch({ type: Types.GET_CHILD_DIVISION_DETAILS, payload: response });

    axios(`/child-divisions/${id}`)
        .then((res) => {
            console.log('division', res)
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            dispatch({ type: Types.GET_CHILD_DIVISION_DETAILS, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_CHILD_DIVISION_DETAILS, payload: response });
        });
}


export const deleteChildDivision = (id: number | string, setShowDeleteModal: any, isAgent: boolean = false) => (dispatch: Dispatch) => {
    let responseData = {
        status: false,
        message: "",
        isLoading: true,
    };
    dispatch({ type: Types.DELETE_CHILD_DIVISION, payload: responseData });

    axios.delete(`/child-divisions/${id}`)
        .then((res) => {
            responseData.isLoading = false;
            responseData.status = true;
            responseData.message = res.message;
            Toaster('success', responseData.message);
            setShowDeleteModal(false);
            dispatch(getDivisionListAction(1, 10, ""));
            dispatch({ type: Types.DELETE_CHILD_DIVISION, payload: responseData });
        })
        .catch((error) => {
            responseData.isLoading = false;
            dispatch({ type: Types.DELETE_CHILD_DIVISION, payload: responseData });
        });
}


export const updateChildDivision = (childdivisionInput:any, router: any, pageType: string = 'edit') => (dispatch: Dispatch) => {
    if (!validateDivisionForm(childdivisionInput)) {
        return;
    }

    let response = {
        status: false,
        message: "",
        isLoading: true,
        pageType,
    };
    dispatch({ type: Types.UPDATE_CHILD_DIVISION ,payload: response });

    axios.put(`/child-divisions/${childdivisionInput.id}`, childdivisionInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            router.push('/child-division');
            dispatch({ type: Types.UPDATE_CHILD_DIVISION, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.UPDATE_CHILD_DIVISION, payload: response });
        });
}

export const getChildDivisionDropdownList = () => (dispatch: Dispatch) => {
    axios.get(`/child-divisions/dropdown/list`)
        .then((res) => {
            dispatch({ type: Types.GET_CHILD_DIVISION_DROPDOWN, payload: res.data });
        });
}