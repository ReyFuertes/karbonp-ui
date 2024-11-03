import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";
import { sortByDesc } from "src/app/shared/util/sort";
import { IPayrunCompleted } from "../../payroll.model";

export const payrollPayRunModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getDownloadedPayRunPdfExportSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollPayrunsCompleted?.downloadedPayRunPdfExport || undefined);
export const getDownloadedPayRunExcelExportSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollPayrunsCompleted?.downloadedPayRunExcelExport || undefined);
export const getPayrollPayrunCompletedSelector = createSelector(
  payrollPayRunModuleState,
  state => state
    ? Object.values(state?.payrollPayrunsCompleted?.entities)
      ?.sort((a: IPayrunCompleted, b: IPayrunCompleted) => sortByDesc(a, b, 'toDate'))
    : []);
export const getPayrollPayrunsCompleteTotalItemsSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollPayrunsCompleted?.payRunCompletetotalCount || 0);