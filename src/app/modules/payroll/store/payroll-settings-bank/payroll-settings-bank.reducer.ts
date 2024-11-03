import { Action, createReducer, on } from "@ngrx/store";

import { getPayrollSettingsBanksSuccessAction, getPayrollSettingsBankTypesSuccessAction } from "./payroll-settings-bank.action";
import { IBankSetup, IBankType } from "../../payroll.model";

export interface PayrollSettingsBanksSetupState {
  isLoading: boolean;
  banks: IBankSetup[];
  bankTypes: IBankType[];
}
export const initialState: PayrollSettingsBanksSetupState = {
  isLoading: false,
  banks: undefined,
  bankTypes: []
}
const payrollSettingsBanksSetupReducer = createReducer(
  initialState,
  on(getPayrollSettingsBankTypesSuccessAction, (state, action) => {
    return Object.assign({}, state, { bankTypes: action.response });
  }),
  on(getPayrollSettingsBanksSuccessAction, (state, action) => {
    return Object.assign({}, state, { banks: action.response });
  })
);
export function PayrollSettingsBanksSetupReducer(state: PayrollSettingsBanksSetupState, action: Action) {
  return payrollSettingsBanksSetupReducer(state, action);
}
