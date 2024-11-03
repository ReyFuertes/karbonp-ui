import { Action, createReducer, on } from "@ngrx/store";
import { IPayrollCalculation } from "../../payroll.model";
import { getPayrollSettingsCalculationsSuccessAction } from "./payroll-settings-calculations.action";


export interface PayrollSettingsCalculationState {
  isLoading: boolean;
  payrollCalculation: IPayrollCalculation;
  paymenthSheme: string[];
}
export const initialState: PayrollSettingsCalculationState = {
  isLoading: false,
  payrollCalculation: undefined,
  paymenthSheme: []
}
const payrollSettingsCalculationReducer = createReducer(
  initialState,
  on(getPayrollSettingsCalculationsSuccessAction, (state, action) => {
    return Object.assign({}, state, {
      payrollCalculation: action.response?.data?.payrollCalculation,
      paymentSchemes: action.response?.data?.paymentSchemes
    });
  }),
);
export function PayrollSettingsCalculationReducer(state: PayrollSettingsCalculationState, action: Action) {
  return payrollSettingsCalculationReducer(state, action);
}
