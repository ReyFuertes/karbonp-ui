import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollPayRunModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getPayrollSettingsPaymentSchemesSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsCalculations?.paymenthSheme || undefined);
export const getPayrollSettingsCalculationsSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsCalculations?.payrollCalculation || undefined);

