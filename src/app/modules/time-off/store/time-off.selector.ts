

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TimeOffModuleState } from '.';

export const selectedModuleState = createFeatureSelector<TimeOffModuleState>('timeOffModule');
export const getIsLoadingEmployeesSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.isLoadingEmployees || false);
export const getTimeOffDownloadBulkImportFileSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.downloadedBulkImportFile || undefined);
export const getTimeOffBulkImportViewSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.bulkImportView || undefined);
export const getTimeOffLeaveApproverUsersSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.leaveApproverUsers || []);
export const getTimeOffLeaveApproversSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.leaveApprovers || []);
export const getTimeOffSelectedPolicySelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.selectedPolicy || undefined);
export const getTimeOffSelectedEntitlementPolicySelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.selectedEntitlementPolicy || undefined);
export const getTimeOffBookingSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.timeOffBooking || []);
export const getTimeOffBalanceReportDataSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.timeOffBalanceReportData || []);
export const getLeaveTimeOffHolidaysSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.timeOffHolidays || []);
export const getTimeOffRequestLoadingSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.isLoading);
export const getSaveUpdatestatusSelector = createSelector(
  selectedModuleState,
  state => state?.timeOff.saveUpdateStatus);
