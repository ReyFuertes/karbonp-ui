import { Action, createReducer, on } from "@ngrx/store";

import { IPaymentDetail } from "../../payroll.model";
import { getpaymentDetailAction, getpaymentDetailSuccessAction } from "./payroll-payment.action";

export interface PayrollPaymentState {
  isLoading: boolean;
  detail: IPaymentDetail;
}
export const initialState: PayrollPaymentState = {
  isLoading: false,
  detail: undefined,
}
const payrollPaymentReducer = createReducer(
  initialState,
  on(getpaymentDetailAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getpaymentDetailSuccessAction, (state, action) => {
    return Object.assign({}, state, { detail: action.response?.data, isLoading: false });
  })
);
export function PayrollPaymentReducer(state: PayrollPaymentState, action: Action) {
  return payrollPaymentReducer(state, action);
}
