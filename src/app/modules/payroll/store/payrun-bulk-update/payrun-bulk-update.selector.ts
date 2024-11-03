import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getPayRunBulkHoursImportViewSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunBulkUpdate?.bulkHoursImportView || undefined);
export const getPayrollDownloadBulkHoursImportFileSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunBulkUpdate?.downloadedBulkHoursImportFile || undefined);
export const getBulkPayRunUpdateOptionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunBulkUpdate?.bulkPayRunUpdateOption || undefined);
export const getPayRunBulkImportViewSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunBulkUpdate?.bulkImportView || undefined);
export const getPayrollDownloadBulkImportFileSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunBulkUpdate?.downloadedBulkImportFile || undefined);
export const getPayrunBulkUpdateSetupDataSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunBulkUpdate?.payrollSetupData);
export const getPayRunEmployeeDataSelector = createSelector(
  payrollModuleState,
  state => state
    ? Object.values(state?.payrollPayrunBulkUpdate?.entities)
    : []);
export const getPayrunBulkUpdateLoadingSelector = createSelector(
  payrollModuleState,
  state => state?.payrollPayrunBulkUpdate?.isLoading);