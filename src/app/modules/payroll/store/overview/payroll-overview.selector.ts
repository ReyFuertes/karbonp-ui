import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getGrossSalariesByMonthForFinancialYearSelector = createSelector(
  payrollModuleState,
  state => state?.payrollOverview?.grossSalaryByMonthlyFinancialYear || []);
export const getGetPayRunsPerMonthOverviewSelector = createSelector(
  payrollModuleState,
  state => state?.payrollOverview?.payRunsPerMonth || undefined);
export const getPayrollSelector = createSelector(
  payrollModuleState,
  state => state
    ? Object.values(state?.payrollOverview)
    : []);
export const getPayrollEtfSetupSelector = createSelector(
  payrollModuleState,
  state => state?.payrollOverview.eftSetup);
export const getPayrollLoadingSelector = createSelector(
  payrollModuleState,
  state => state?.payrollOverview.isLoading);
