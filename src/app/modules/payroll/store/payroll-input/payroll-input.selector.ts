import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getBasicSalaryPayrollInputSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunInput?.basicSalaryPayrollInput || undefined);
export const getPayrollcalculationSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunInput?.payrollcalculation || undefined);
export const getPayrollPayPointSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunInput?.payPoint || undefined);
export const getPhilippinesRegulatedSettingSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunInput?.philippinesRegulatedSetting || undefined);
export const getSelectedPayrollInputSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunInput?.selectedPayrollInput || undefined);
export const getSelectedDeductionPayrollInputSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunInput?.selectedDeductionPayrollInput || undefined);
export const getPayrollInputLoadingSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunInput?.isLoading)