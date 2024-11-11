import axios from "@/utils/axios";
import * as Types from "../types/dashboard-type";
import { Dispatch } from "@reduxjs/toolkit";
import { format } from "date-fns";


export const getDashboardCountingAction = (project_id: string, branch_id: string, business_month: string, date_range: [Date | null, Date | null]) => (dispatch: Dispatch) => {

  let response = {
    status: false,
    message: "",
    isLoading: true,
    data: [],
  };
  dispatch({ type: Types.GET_DASHBOARD_COUNTING, payload: response });

  let baseURL = `/dashboard/counting`;
  axios.get(baseURL)
    .then((res) => {
      response.isLoading = false;
      response.status = true;
      response.message = res.message;
      response.data = res.data;
      dispatch({ type: Types.GET_DASHBOARD_COUNTING, payload: response });
    })
    .catch((error) => {
      response.isLoading = false;
      dispatch({ type: Types.GET_DASHBOARD_COUNTING, payload: response });
    });
};