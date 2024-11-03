import { Action, createReducer, on } from "@ngrx/store";

import { IPayslipSetup } from "../../payroll.model";
import { getPayrollSettingsPayslipsSuccessAction } from "./payroll-settings-payslip.action";

export interface PayrollSettingsPayslipSetupState {
  isLoading: boolean;
  payslipSetup: IPayslipSetup;
}
export const initialState: PayrollSettingsPayslipSetupState = {
  isLoading: false,
  payslipSetup: undefined
}
const payrollSettingsPayslipSetupReducer = createReducer(
  initialState,
  on(getPayrollSettingsPayslipsSuccessAction, (state, action) => {
    return Object.assign({}, state, { payslipSetup: action.response });
  }),
);
export function PayrollSettingsPayslipSetupReducer(state: PayrollSettingsPayslipSetupState, action: Action) {
  return payrollSettingsPayslipSetupReducer(state, action);
}
