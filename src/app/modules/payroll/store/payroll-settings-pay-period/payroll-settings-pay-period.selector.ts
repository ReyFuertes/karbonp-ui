import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";
import { sortByDesc } from "src/app/shared/util/sort";
import { IPayPeriod } from "src/app/models/generic.model";

export const payrollPayRunModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');

export const getPayPeriodDateRangeSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsPayPeriod?.payPeriodDateRange || [])
export const getPayrollSettingsPayPeriodByIdSelector = (id: number) => createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsPayPeriod?.entities[id] || undefined)
export const getPayrollSettingsPayPeriodsSelector = createSelector(
  payrollPayRunModuleState,
  state => state
    ? Object.values(state?.payrollSettingsPayPeriod?.entities)
      ?.sort((a: IPayPeriod, b: IPayPeriod) => sortByDesc(a, b, 'id'))
    : []);
export const getPayrollSettingsPayPeriodTotalItemsSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsPayPeriod?.payRunPayPeriodtotalCount || 0);