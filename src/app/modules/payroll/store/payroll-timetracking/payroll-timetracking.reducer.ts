import { Action, createReducer, on } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { IPayrunCompleted } from "../../payroll.model";
import { getPayrunTimeAttendanceSuccessAction, getPayrunTimeTrackingIntegrationSuccessAction } from "./payroll-timetracking.action";

export interface PayrollPayrunTimetrackingIntegrationState extends EntityState<IPayrunCompleted> {
  isLoading: boolean;
  timeTrackingEnabled: boolean;
  timeAttendance: { companyId: number, enabled: boolean, id: number }
}
export const adapter: EntityAdapter<IPayrunCompleted> = createEntityAdapter<IPayrunCompleted>({
});
export const initialState: PayrollPayrunTimetrackingIntegrationState = adapter.getInitialState({
  isLoading: false,
  timeTrackingEnabled: false,
  timeAttendance: undefined
})
const payrollPayrunTimetrackingIntegrationReducer = createReducer(
  initialState,
  on(getPayrunTimeAttendanceSuccessAction, (state, action) => {
    return Object.assign({}, state, { timeAttendance: !!action.response });
  }),
  on(getPayrunTimeTrackingIntegrationSuccessAction, (state, action) => {
    return Object.assign({}, state, { timeTrackingEnabled: !!action.response });
  })
);
export function PayrollPayrunTimetrackingIntegrationReducer(state: PayrollPayrunTimetrackingIntegrationState, action: Action) {
  return payrollPayrunTimetrackingIntegrationReducer(state, action);
}
