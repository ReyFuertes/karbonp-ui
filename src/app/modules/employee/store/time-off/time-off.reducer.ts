import { Action, createReducer, on } from "@ngrx/store";
import { getEmployeeLatestTimeBalanceSuccessAction, getEmployeeTimeOffActivitiesSuccessAction, getEmployeeTimeOffAdjustmentsSuccessAction, getEmployeeTimeOffBookingsSuccessAction, getEmployeeTimeOffPolicySuccessAction, getEmployeeTimeOffTakeOnsSuccessAction, getEmployeesTimeOffRequestBookingsOverviewSuccessAction, setEmployeeTimeOffLoadingAction } from "./time-off.action";
import { IEmployeeTimeOffBookings, ILatestTimeBalance } from "src/app/models/generic.model";
import { IEmployeeTimeOffActivity, IEmployeeTimeOffBookingsOverview, IEmployeeTimeOffPolicy, IEmployeeTimeOffTakeOn, ITimeOffAdjustment } from "../../employee.model";

export interface EmployeeTimeOffState {
  isLoading: boolean,
  employeeLatestTimeBalance: ILatestTimeBalance[];
  employeeTimeOffBookings: IEmployeeTimeOffBookings;
  employeeTimeOffAdjustments: ITimeOffAdjustment[];
  employeeTimeOffPolicies: IEmployeeTimeOffPolicy[];
  employeeTimeOffTakeOns: IEmployeeTimeOffTakeOn[];
  employeeTimeOffActivities: IEmployeeTimeOffActivity[];
  employeesTimeOffBookingsOverview: IEmployeeTimeOffBookingsOverview[];
}
export const initialState: EmployeeTimeOffState = {
  isLoading: false,
  employeeLatestTimeBalance: [],
  employeeTimeOffBookings: undefined,
  employeeTimeOffAdjustments: [],
  employeeTimeOffPolicies: [],
  employeeTimeOffTakeOns: [],
  employeeTimeOffActivities: [],
  employeesTimeOffBookingsOverview: [],
};
const employeeTimeOffReducer = createReducer(
  initialState,
  on(getEmployeeLatestTimeBalanceSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeeLatestTimeBalance: action.response });
  }),
  on(getEmployeesTimeOffRequestBookingsOverviewSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeesTimeOffBookingsOverview: action.response });
  }),
  on(getEmployeeTimeOffActivitiesSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeeTimeOffActivities: action.response });
  }),
  on(getEmployeeTimeOffTakeOnsSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeeTimeOffTakeOns: action.response });
  }),
  on(getEmployeeTimeOffPolicySuccessAction, (state, action) => {
    return Object.assign({}, state, { employeeTimeOffPolicies: action.response });
  }),
  on(getEmployeeTimeOffAdjustmentsSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeeTimeOffAdjustments: action.response });
  }),
  on(getEmployeeTimeOffBookingsSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeeTimeOffBookings: action.response });
  }),
  on(setEmployeeTimeOffLoadingAction, (state, action) => {
    return Object.assign({}, state, { isLoading: action.loading });
  }),
);
export function EmployeeTimeOffReducer(state: EmployeeTimeOffState, action: Action) {
  return employeeTimeOffReducer(state, action);
}