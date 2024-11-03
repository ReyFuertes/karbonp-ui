import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const isSchedulePaymenthasErrorSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPaymentSchedule?.hasError || false);
export const getSchedulePaymentSetupDataSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPaymentSchedule?.schedulePaymentSetupData);
