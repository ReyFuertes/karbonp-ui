import { Action, createReducer, on } from "@ngrx/store";

import { ILeaveApprover, ITimeOffBalanceReport, IPublicHoliday, IleaveApproverUser } from "../time-off.model";
import { clearTimeOffBalanceReportDataAction, downloadTimeOffBulkImportFileSuccessAction, getTimeOffBalanceReportDataAction, getTimeOffBalanceReportDataSuccessAction, getTimeOffBulkImportViewSuccessAction, getTimeOffLeaveApproverUsersSuccessAction, getTimeOffLeaveApproversSuccessAction, getTimeOffLeaveEntitlementPolicyByIdSuccessAction, getTimeOffPublicHolidaysSuccessAction, getTimeOffRequestAction, getTimeOffRequestSuccessAction, getTimeOffTimeOffPolicyByIdSuccessAction, saveTimeOffLeaveApproverSuccessAction, setTimeOffSaveUpdateStatusAction, updateTimeOffEntitlementPolicySuccessAction } from "./time-off.action";
import { ICommonResponse, IEntitlementPolicy, ILeaveSetup, ITimeOffBooking } from "src/app/models/generic.model";
import { GenericState } from "src/app/store/app.reducer";

export interface TimeOffState extends GenericState {
  isLoadingEmployees: boolean;
  saveUpdateStatus: boolean;
  timeOffHolidays: IPublicHoliday[];
  timeOffBalanceReportData: ITimeOffBalanceReport[];
  timeOffBooking: ITimeOffBooking[];
  selectedEntitlementPolicy: IEntitlementPolicy;
  selectedPolicy: ILeaveSetup;
  leaveApprovers: ILeaveApprover[];
  leaveApproverUsers: IleaveApproverUser[];
  bulkImportView: ICommonResponse;
  downloadedBulkImportFile: any;
}
export const initialState: TimeOffState = {
  isLoading: false,
  isLoadingEmployees: false,
  saveUpdateStatus: undefined,
  timeOffHolidays: [],
  timeOffBalanceReportData: [],
  timeOffBooking: [],
  selectedEntitlementPolicy: undefined,
  selectedPolicy: undefined,
  leaveApprovers: [],
  leaveApproverUsers: [],
  bulkImportView: undefined,
  downloadedBulkImportFile: undefined
};
const timeOffReducer = createReducer(
  initialState,
  on(downloadTimeOffBulkImportFileSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedBulkImportFile: action.response });
  }),
  on(getTimeOffBulkImportViewSuccessAction, (state, action) => {
    return Object.assign({}, state, { bulkImportView: action.response?.data });
  }),
  on(saveTimeOffLeaveApproverSuccessAction, (state) => {
    return Object.assign({}, state, { saveUpdateStatus: undefined });
  }),
  on(getTimeOffLeaveApproverUsersSuccessAction, (state, action) => {
    return Object.assign({}, state, { leaveApproverUsers: action.response });
  }),
  on(getTimeOffLeaveApproversSuccessAction, (state, action) => {
    return Object.assign({}, state, { leaveApprovers: action.response });
  }),
  on(getTimeOffTimeOffPolicyByIdSuccessAction, (state, action) => {
    return Object.assign({}, state, { selectedPolicy: action.response });
  }),
  on(setTimeOffSaveUpdateStatusAction, (state, response) => {
    return Object.assign({}, state, { saveUpdateStatus: response.status });
  }),
  on(updateTimeOffEntitlementPolicySuccessAction, (state) => {
    return Object.assign({}, state, { saveUpdateStatus: undefined });
  }),
  on(getTimeOffLeaveEntitlementPolicyByIdSuccessAction, (state, action) => {
    return Object.assign({}, state, { selectedEntitlementPolicy: action.response });
  }),
  on(getTimeOffRequestAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getTimeOffRequestSuccessAction, (state, action) => {
    return Object.assign({}, state, { timeOffBooking: action.response, isLoading: false });
  }),
  on(clearTimeOffBalanceReportDataAction, (state) => {
    return Object.assign({}, state, { timeOffBalanceReportData: [] });
  }),
  on(getTimeOffBalanceReportDataAction, (state) => {
    return Object.assign({}, state, { isLoadingEmployees: true });
  }),
  on(getTimeOffBalanceReportDataSuccessAction, (state, action) => {
    return Object.assign({}, state, { timeOffBalanceReportData: action.response, isLoadingEmployees: false });
  }),
  on(getTimeOffPublicHolidaysSuccessAction, (state, action) => {
    return Object.assign({}, state, { timeOffHolidays: action.response });
  })
);
export function TimeOffReducer(state: TimeOffState, action: Action) {
  return timeOffReducer(state, action);
}