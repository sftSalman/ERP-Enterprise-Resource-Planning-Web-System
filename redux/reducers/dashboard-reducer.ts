import * as Types from "../types/dashboard-type";

const initialState = {
  isLoading: false,
  dashboardCount: {
    total_division: 0,
    total_sub_division: 0,

    total_department: 0,
    total_employee: 0,
  }
};

export default function dashboardReducer(
  state = initialState,
  action: any
) {
  switch (action.type) {
    case Types.GET_DASHBOARD_COUNTING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
        dashboardCount: action.payload.data,
      };

    default:
      break;
  }
  return state;
}
