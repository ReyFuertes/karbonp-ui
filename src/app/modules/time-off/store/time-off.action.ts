import { createAction, props } from "@ngrx/store";

import { ITimeOffBalanceReportPayload, ITimeOffBalanceReport, IPublicHoliday, IEntitlementPolicyPayload, ILeaveApprover, IleaveApproverUser } from "../time-off.model";
import { ICommonResponse, IEntitlementPolicy, ILeaveSetup, ISimplePayload, ITimeOffBooking, ITimeOffRequestPayload } from "src/app/models/generic.model";

export enum TimeOffActionTypes {
  setTimeOffSaveUpdateStatusAction = '[Time-Off] set save update status',
  getTimeOffPublicHolidaysAction = '[Time-Off] get public holidays',
  getTimeOffPublicHolidaysSuccessAction = '[Time-Off] get public holidays (success)',
  getTimeOffBalanceReportDataAction = '[Time-Off] get balances report data',
  getTimeOffBalanceReportDataSuccessAction = '[Time-Off] get balances report data (success)',
  clearTimeOffBalanceReportDataAction = '[Time-Off] clear balances report data',
  getTimeOffRequestAction = '[TimeOff] get time off requests',
  getTimeOffRequestSuccessAction = '[TimeOff] get time off requests (success)',
  updateTimeOffRequestAction = '[TimeOff] update time off requests',
  updateTimeOffRequestSuccessAction = '[TimeOff] update time off requests (success)',
  updateTimeOffPolicySettingsAction = '[TimeOff] update time off policy',
  updateTimeOffPolicySettingsSuccessAction = '[TimeOff] update time off policy (success)',
  getTimeOffLeaveEntitlementPolicyByIdAction = '[TimeOff] get time off leave entitlement policy',
  getTimeOffLeaveEntitlementPolicyByIdSuccessAction = '[TimeOff] get time off leave entitlement policy (success)',
  updateTimeOffEntitlementPolicyAction = '[TimeOff] update time off entitlement policy',
  updateTimeOffEntitlementPolicySuccessAction = '[TimeOff] update time off entitlement policy (success)',
  getTimeOffTimeOffPolicyByIdAction = '[TimeOff] get time off policy by id',
  getTimeOffTimeOffPolicyByIdSuccessAction = '[TimeOff] get time off policy by id (success)',
  getTimeOffLeaveApproversAction = '[TimeOff] get time off leave approvers',
  getTimeOffLeaveApproversSuccessAction = '[TimeOff] get time off leave approvers (success)',
  saveTimeOffLeaveApproverAction = '[TimeOff] save time off leave approver',
  saveTimeOffLeaveApproverSuccessAction = '[TimeOff] save time off leave approver (success)',
  deleteTimeOffLeaveApproverAction = '[TimeOff] delete time off leave approver',
  deleteTimeOffLeaveApproverSuccessAction = '[TimeOff] delete time off leave approver (success)',
  getTimeOffLeaveApproverUsersAction = '[TimeOff] get time off leave approver users',
  getTimeOffLeaveApproverUsersSuccessAction = '[TimeOff] get time off leave approver users (success)',
  uploadTimeOffBulkImportAction = '[TimeOff] save time off bulk import',
  uploadTimeOffBulkImportSuccessAction = '[TimeOff] save time off bulk import (success)',
  getTimeOffBulkImportViewAction = '[TimeOff] get time off bulk import view',
  getTimeOffBulkImportViewSuccessAction = '[TimeOff] get time off bulk import view (success)',
  downloadTimeOffBulkImportFileAction = '[TimeOff] download time off bulk import file',
  downloadTimeOffBulkImportFileSuccessAction = '[TimeOff] download time off bulk import file (success)',
}
export const downloadTimeOffBulkImportFileAction = createAction(
  TimeOffActionTypes.downloadTimeOffBulkImportFileAction
);
export const downloadTimeOffBulkImportFileSuccessAction = createAction(
  TimeOffActionTypes.downloadTimeOffBulkImportFileSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getTimeOffBulkImportViewAction = createAction(
  TimeOffActionTypes.getTimeOffBulkImportViewAction
);
export const getTimeOffBulkImportViewSuccessAction = createAction(
  TimeOffActionTypes.getTimeOffBulkImportViewSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const uploadTimeOffBulkImportAction = createAction(
  TimeOffActionTypes.uploadTimeOffBulkImportAction,
  props<{ payload: { file: string, reCalculatePayslips: boolean } }>()
);
export const uploadTimeOffBulkImportSuccessAction = createAction(
  TimeOffActionTypes.uploadTimeOffBulkImportSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getTimeOffLeaveApproverUsersAction = createAction(
  TimeOffActionTypes.getTimeOffLeaveApproverUsersAction,
  props<{ payload: ISimplePayload }>()
);
export const getTimeOffLeaveApproverUsersSuccessAction = createAction(
  TimeOffActionTypes.getTimeOffLeaveApproverUsersSuccessAction,
  props<{ response: IleaveApproverUser[] }>()
);
export const deleteTimeOffLeaveApproverAction = createAction(
  TimeOffActionTypes.deleteTimeOffLeaveApproverAction,
  props<{ id: number }>()
);
export const deleteTimeOffLeaveApproverSuccessAction = createAction(
  TimeOffActionTypes.deleteTimeOffLeaveApproverSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const saveTimeOffLeaveApproverAction = createAction(
  TimeOffActionTypes.saveTimeOffLeaveApproverAction,
  props<{ payload: { leaveApproverItems: ILeaveApprover[] } }>()
);
export const saveTimeOffLeaveApproverSuccessAction = createAction(
  TimeOffActionTypes.saveTimeOffLeaveApproverSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getTimeOffLeaveApproversAction = createAction(
  TimeOffActionTypes.getTimeOffLeaveApproversAction,
  props<{ payload: ITimeOffRequestPayload }>()
);
export const getTimeOffLeaveApproversSuccessAction = createAction(
  TimeOffActionTypes.getTimeOffLeaveApproversSuccessAction,
  props<{ response: ILeaveApprover[] }>()
);
export const getTimeOffTimeOffPolicyByIdAction = createAction(
  TimeOffActionTypes.getTimeOffTimeOffPolicyByIdAction,
  props<{ id: number }>()
);
export const getTimeOffTimeOffPolicyByIdSuccessAction = createAction(
  TimeOffActionTypes.getTimeOffTimeOffPolicyByIdSuccessAction,
  props<{ response: ILeaveSetup }>()
);
export const updateTimeOffEntitlementPolicyAction = createAction(
  TimeOffActionTypes.updateTimeOffEntitlementPolicyAction,
  props<{ payload: IEntitlementPolicyPayload }>()
);
export const updateTimeOffEntitlementPolicySuccessAction = createAction(
  TimeOffActionTypes.updateTimeOffEntitlementPolicySuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getTimeOffLeaveEntitlementPolicyByIdAction = createAction(
  TimeOffActionTypes.getTimeOffLeaveEntitlementPolicyByIdAction,
  props<{ id: number }>()
);
export const getTimeOffLeaveEntitlementPolicyByIdSuccessAction = createAction(
  TimeOffActionTypes.getTimeOffLeaveEntitlementPolicyByIdSuccessAction,
  props<{ response: IEntitlementPolicy }>()
);
export const updateTimeOffPolicySettingsAction = createAction(
  TimeOffActionTypes.updateTimeOffPolicySettingsAction,
  props<{ payload: ILeaveSetup }>()
);
export const updateTimeOffPolicySettingsSuccessAction = createAction(
  TimeOffActionTypes.updateTimeOffPolicySettingsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const updateTimeOffRequestAction = createAction(
  TimeOffActionTypes.updateTimeOffRequestAction,
  props<{ payload: { approve: boolean; approveDeclineNote?: string; timeOffBookingId: number }, employeeIds?: number[] }>()
);
export const updateTimeOffRequestSuccessAction = createAction(
  TimeOffActionTypes.updateTimeOffRequestSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getTimeOffRequestAction = createAction(
  TimeOffActionTypes.getTimeOffRequestAction,
  props<{ payload: ITimeOffRequestPayload }>()
);
export const getTimeOffRequestSuccessAction = createAction(
  TimeOffActionTypes.getTimeOffRequestSuccessAction,
  props<{ response: ITimeOffBooking[] }>()
);
export const clearTimeOffBalanceReportDataAction = createAction(
  TimeOffActionTypes.clearTimeOffBalanceReportDataAction
);
export const getTimeOffBalanceReportDataAction = createAction(
  TimeOffActionTypes.getTimeOffBalanceReportDataAction,
  props<{ payload: ITimeOffBalanceReportPayload }>()
);
export const getTimeOffBalanceReportDataSuccessAction = createAction(
  TimeOffActionTypes.getTimeOffBalanceReportDataSuccessAction,
  props<{ response: ITimeOffBalanceReport[] }>()
);
export const getTimeOffPublicHolidaysAction = createAction(
  TimeOffActionTypes.getTimeOffPublicHolidaysAction,
  props<{ payload: ITimeOffRequestPayload }>()
);
export const getTimeOffPublicHolidaysSuccessAction = createAction(
  TimeOffActionTypes.getTimeOffPublicHolidaysSuccessAction,
  props<{ response: IPublicHoliday[] }>()
);
export const setTimeOffSaveUpdateStatusAction = createAction(
  TimeOffActionTypes.setTimeOffSaveUpdateStatusAction,
  props<{ status: boolean, message?: string }>()
);