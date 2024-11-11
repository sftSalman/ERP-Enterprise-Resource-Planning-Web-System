import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "@/redux/reducers/AuthReducer";
import employeeReducer from "@/redux/reducers/employee-reducer";
import globalReducer from "@/redux/reducers/global-reducer";
import designationReducer from "../reducers/designation-reducer";
import departmentReducer from "../reducers/department-reducer";
import divisionReducer from "../reducers/division-reducer";
import subDivisionReducer from "../reducers/sub-division-reducer";
import dashboardReducer from "../reducers/dashboard-reducer";
import childDivisionReducer from "../reducers/child-division-reducer";
import roleReducer from "../reducers/role-reducer";

export const store = configureStore({
  reducer: {
    Auth: AuthReducer,
    global: globalReducer,
    employee: employeeReducer,
    designation: designationReducer,
    department: departmentReducer,
    division: divisionReducer,
    subDivision: subDivisionReducer,
    childDivision: childDivisionReducer,
    dashboard: dashboardReducer,
    role: roleReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
