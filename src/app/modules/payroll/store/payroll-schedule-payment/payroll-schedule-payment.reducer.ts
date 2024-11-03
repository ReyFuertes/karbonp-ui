import { Action, createReducer, on } from "@ngrx/store";

import { GenericState } from "src/app/store/app.reducer";
import { getSchedulePaymentSetupDataSuccessAction, saveSchedulePaymentSuccessAction } from "./payroll-schedule-payment.action";
import { ISchedulePaymentSetupData } from "../../payroll.model";

export interface PayrollPaymentScheduleState extends GenericState {
  schedulePaymentSetupData: ISchedulePaymentSetupData;
}
export const initialState: PayrollPaymentScheduleState = {
  isLoading: false,
  hasError: false,
  schedulePaymentSetupData: undefined
};

const payrollPaymentScheduleReducer = createReducer(
  initialState,
  on(saveSchedulePaymentSuccessAction, (state, action) => {
    return Object.assign({}, state, { hasError: action.response?.errorMessage?.length > 0 });
  }),
  on(getSchedulePaymentSetupDataSuccessAction, (state, action) => {
    return Object.assign({}, state, { schedulePaymentSetupData: action.response?.data });
  }),
);
export function PayrollPaymentScheduleReducer(state: PayrollPaymentScheduleState, action: Action) {
  return payrollPaymentScheduleReducer(state, action);
}
