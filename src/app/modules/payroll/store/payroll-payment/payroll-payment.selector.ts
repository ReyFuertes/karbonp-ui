import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollPayRunModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');

export const getTradeClassificationGroupsSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollFilingDetail?.tradeClassificationGroups || undefined)
export const getPayrollPaymentSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollPayment?.detail || undefined)
export const getPayrollPaymentIsloadingSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollPayment?.isLoading || false)

