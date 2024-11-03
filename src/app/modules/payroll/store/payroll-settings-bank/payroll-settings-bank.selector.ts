import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollPayRunModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getSettingsBankTypesSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsBanksSetup?.bankTypes || [])
export const getSettingsBanksSetupSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsBanksSetup?.banks || [])

