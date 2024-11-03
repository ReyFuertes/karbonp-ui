import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getPayrollPayrunTimeAttendanceSelector = createSelector(
  payrollModuleState,
  state => state.payrollPayrunsTimetrackingIntegration?.timeAttendance
)
export const getPayrollPayrunTimetrackingIntegrationSelector = createSelector(
  payrollModuleState,
  state => state.payrollPayrunsTimetrackingIntegration?.timeTrackingEnabled
)