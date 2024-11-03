import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollPayRunModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');

export const getSettingsPayslipSetupSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsPayslipSetup?.payslipSetup || undefined)

