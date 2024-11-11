import axios from "@/utils/axios";
import * as Types from "../types/employee-type";
import { Toaster } from "@/components/toaster";
import { Dispatch } from "@reduxjs/toolkit";

export const changeInputValue = (name: string, value: any, e: any) => (dispatch: Dispatch) => {
    let data = {
        name: name,
        value: value,
    }
    dispatch({ type: Types.CHANGE_INPUT_VALUE, payload: data });

    if (name === "avatar") {
        let reader = new FileReader();
        const file = e.target.files[0];
        reader.onloadend = () => {
            // data.name = "avatar";
            data.value = reader.result;
            dispatch({ type: Types.CHANGE_INPUT_VALUE, payload: data });
        };
        reader.readAsDataURL(file);
    }
    // if (name === 'image') {
    //     let reader = new FileReader();
    //     const file = e.target.files[0];
    //     reader.onloadend = () => {
    //         if (name === "image") {
    //             data.name = 'avatar';
    //         } 
    //         data.value = reader.result;
    //         dispatch({ type: Types.CHANGE_INPUT_VALUE, payload: data });

    //         data.value = reader.result;
    //         dispatch({ type: Types.CHANGE_INPUT_VALUE, payload: data });
    //     }
    //     reader.readAsDataURL(file)
    // }
};

export const emptyEmployeeInputAction = () => (dispatch: Dispatch) => {
    dispatch({ type: Types.EMPTY_EMPLOYEE_INPUT, payload: {} });
};

export const validateEmployeeForm = (employeeInput) => {
    if (employeeInput.first_name === "") {
        Toaster("error", "Please give first name.");
        return false;
    }
    // if (employeeInput.last_name === "") {
    //     Toaster("error", "Please give last name.");
    //     return false;
    // }
    if (employeeInput.email === "") {
        Toaster("error", "Please give employee email.");
        return false;
    }
    if (employeeInput.phone === "") {
        Toaster("error", "Please give employee phone no.");
        return false;
    }

    return true;
}

export const createEmployee = (employeeInput, router) => (dispatch: Dispatch) => {
    if (!validateEmployeeForm(employeeInput)) {
        return;
    }
    let response = {
        status: false,
        message: "",
        isLoading: true,
    };
    dispatch({ type: Types.CREATE_EMPLOYEE, payload: response });

    axios.post(`/employees`, employeeInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            router.push('/employee');
            dispatch({ type: Types.CREATE_EMPLOYEE, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.CREATE_EMPLOYEE, payload: response });
        });
}

export const getEmployeeListAction = (currentPage: number = 1, dataLimit: number = 10, searchText: string = '', isAgent: boolean = false) => (dispatch: Dispatch) => {
    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: [],
        paginationData: [],
    };
    dispatch({ type: Types.GET_EMPLOYEE_LIST, payload: response });

    const resourceUrl = 'employees';

    axios.get(`/${resourceUrl}?perPage=${dataLimit}&page=${currentPage}&search=${searchText}`)
        .then((res) => {
            console.log('res', res)
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data.data;
            response.paginationData = res.data;
            console.log('response', response)
            dispatch({ type: Types.GET_EMPLOYEE_LIST, payload: response });
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_EMPLOYEE_LIST, payload: response })
        })

}

export const getEmployeeChartAction = () => (dispatch: Dispatch) => {
    let response = {
        status: false,
        message: "",
        isLoading: true,
        data: [],
        paginationData: [],
    };
    dispatch({ type: Types.GET_EMPLOYEE_CHART, payload: response });

    const resourceUrl = 'employees/chart';

    axios.get(`/${resourceUrl}`)
        .then((res) => {
            console.log('Chart', res)
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            dispatch({ type: Types.GET_EMPLOYEE_CHART, payload: response });
        }).catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_EMPLOYEE_CHART, payload: response })
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
    dispatch({ type: Types.GET_EMPLOYEE_DETAILS, payload: response });

    axios(`/employees/${id}`)
        .then((res) => {
            response.isLoading = false;
            response.status = true;
            response.message = res.message;
            response.data = res.data;
            const departments = res.data.departments;
            const departmentIds = [];
            departments.forEach(department => {
                departmentIds.push({
                    label: department.department_name,
                    value: department.department_id,
                })
            });
            response.data.department_ids = departmentIds;
            dispatch({ type: Types.GET_EMPLOYEE_DETAILS, payload: response });
        })
        .catch((error) => {
            response.isLoading = false;
            dispatch({ type: Types.GET_EMPLOYEE_DETAILS, payload: response });
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


export const updateEmployee = (employeeInput:any, router: any, pageType: string = 'edit', isAgent: boolean = false) => (dispatch: Dispatch) => {
    if (!validateEmployeeForm(employeeInput)) {
        return;
    }
    let response = {
        status: false,
        message: "",
        isLoading: false,
        pageType,
    };
    dispatch({ type: Types.UPDATE_EMPLOYEE, payload: response });
    axios.put(`/employees/${employeeInput.id}`, employeeInput)
        .then((res) => {
            response.status = true;
            response.isLoading = false;
            response.message = res.message;
            Toaster('success', response.message);
            if (pageType !== 'profile') {
                router.push('/employee');
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

export const getManagerDropdownList = (isAgent: boolean = false) => (dispatch: Dispatch) => {
    axios.get(`employees/dropdown/list`)
        .then((res) => {
            dispatch({ type: Types.GET_MANAGER_DROPDOWN, payload: res.data });
        })
}
