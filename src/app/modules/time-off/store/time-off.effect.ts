import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { delay, finalize, map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { deleteTimeOffLeaveApproverAction, deleteTimeOffLeaveApproverSuccessAction, downloadTimeOffBulkImportFileAction, downloadTimeOffBulkImportFileSuccessAction, getTimeOffBalanceReportDataAction, getTimeOffBalanceReportDataSuccessAction, getTimeOffBulkImportViewAction, getTimeOffBulkImportViewSuccessAction, getTimeOffLeaveApproverUsersAction, getTimeOffLeaveApproverUsersSuccessAction, getTimeOffLeaveApproversAction, getTimeOffLeaveApproversSuccessAction, getTimeOffLeaveEntitlementPolicyByIdAction, getTimeOffLeaveEntitlementPolicyByIdSuccessAction, getTimeOffPublicHolidaysAction, getTimeOffPublicHolidaysSuccessAction, getTimeOffRequestAction, getTimeOffRequestSuccessAction, getTimeOffTimeOffPolicyByIdAction, getTimeOffTimeOffPolicyByIdSuccessAction, saveTimeOffLeaveApproverAction, saveTimeOffLeaveApproverSuccessAction, setTimeOffSaveUpdateStatusAction, updateTimeOffEntitlementPolicyAction, updateTimeOffEntitlementPolicySuccessAction, updateTimeOffPolicySettingsAction, updateTimeOffPolicySettingsSuccessAction, updateTimeOffRequestAction, updateTimeOffRequestSuccessAction, uploadTimeOffBulkImportAction, uploadTimeOffBulkImportSuccessAction } from "./time-off.action";
import { CommonService } from "src/app/services/common.service";
import { ILeaveApprover, ITimeOffBalanceReport, IPublicHoliday, IleaveApproverUser } from "../time-off.model";
import { EmployeeRequestStatusType, ICommonResponse, IEntitlementPolicy, ILeaveSetup, ITimeOffBooking } from "src/app/models/generic.model";
import { AppState } from "src/app/store";
import { AuthService } from "../../auth/auth.service";
import { LeaveSetupService } from "../../payroll/payroll.service";
import { TimeOffBulkImportService, TimeOffService } from "../time-off.service";
import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { PAGINATION_VARS } from "src/app/shared/constants/generic.constant";


@Injectable()
export class TimeOffEffect extends GenericEffect {
  downloadTimeOffBulkImportFileAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadTimeOffBulkImportFileAction),
    switchMap(() => this.timeOffBulkImportService.get(`/DownloadTimeOffBulkImportFile`)
      .pipe(
        map((response: ICommonResponse) => downloadTimeOffBulkImportFileSuccessAction({ response }))
      ))
  ));

  getTimeOffBulkImportViewAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeOffBulkImportViewAction),
    switchMap(() => this.timeOffBulkImportService.get(`/GetTimeOffBulkImportView`)
      .pipe(
        map((response: ICommonResponse) => getTimeOffBulkImportViewSuccessAction({ response }))
      ))
  ));

  uploadTimeOffBulkImportAction$ = createEffect(() => this.actions$.pipe(
    ofType(uploadTimeOffBulkImportAction),
    switchMap(({ payload }) => this.timeOffBulkImportService.post(payload, `/TimeOffBulkImport`)
      .pipe(
        map((response: ICommonResponse) => uploadTimeOffBulkImportSuccessAction({ response })),
        delay(300),
        finalize(() => this.store.dispatch(getTimeOffBulkImportViewAction()))
      ))
  ));

  getTimeOffLeaveApproverUsersAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeOffLeaveApproverUsersAction),
    switchMap(({ payload }) => this.authService.post(payload, `/user/GetLeaveApprovalUsers`)
      .pipe(
        map((response: IleaveApproverUser[]) => getTimeOffLeaveApproverUsersSuccessAction({ response }))
      ))
  ));

  deleteTimeOffLeaveApproverAction$ = createEffect(() => this.actions$.pipe(
    ofType(deleteTimeOffLeaveApproverAction),
    switchMap(({ id }) => this.commonService.delete(`LeaveApprover/${id}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Deleted Successfully')),
        map((response: ICommonResponse) => deleteTimeOffLeaveApproverSuccessAction({ response }))
      ))
  ));

  saveTimeOffLeaveApproverAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveTimeOffLeaveApproverAction),
    switchMap(({ payload }) => this.commonService.post(payload, `LeaveApprover`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveTimeOffLeaveApproverSuccessAction({ response }))
      ))
  ));

  getTimeOffLeaveApproversAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeOffLeaveApproversAction),
    switchMap(({ payload }) => this.commonService.post(payload, `LeaveApprover/GetLeaveApprovers`)
      .pipe(
        map((response: ILeaveApprover[]) => getTimeOffLeaveApproversSuccessAction({ response }))
      ))
  ));

  getTimeOffTimeOffPolicyByIdAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeOffTimeOffPolicyByIdAction),
    switchMap(({ id }) => this.leaveSetupService.get(`/${id}`)
      .pipe(
        map((response: ILeaveSetup) => getTimeOffTimeOffPolicyByIdSuccessAction({ response }))
      ))
  ));

  updateTimeOffEntitlementPolicyAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateTimeOffEntitlementPolicyAction),
    switchMap(({ payload }) => this.leaveSetupService.post(payload, `/SaveLeaveEntitlementPolicy`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Updated Successfully')),
        map((response: ICommonResponse) => updateTimeOffEntitlementPolicySuccessAction({ response }))
      ))
  ));

  getTimeOffLeaveEntitlementPolicyByIdAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeOffLeaveEntitlementPolicyByIdAction),
    switchMap(({ id }) => this.leaveSetupService.get(`/GetLeaveEntitlementPolicy/${id}`)
      .pipe(
        map((response: IEntitlementPolicy) => getTimeOffLeaveEntitlementPolicyByIdSuccessAction({ response }))
      ))
  ));

  updateTimeOffPolicySettingsAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateTimeOffPolicySettingsAction),
    switchMap(({ payload }) => this.commonService.post(payload, `LeaveSetup`)
      .pipe(
        tap((response) => {
          this.store.dispatch(setTimeOffSaveUpdateStatusAction({ status: Object.prototype.hasOwnProperty.call(response, 'errors') || false }));
        }),
        map((response: ICommonResponse) => {
          return updateTimeOffPolicySettingsSuccessAction({ response })
        })
      ))
  ));

  updateTimeOffRequestAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateTimeOffRequestAction),
    switchMap(({ payload, employeeIds }) => this.timeOffService.post(payload, `/UpdateTimeOffBookingForTimeOffRequest`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response) => {
          return updateTimeOffRequestSuccessAction({ response })
        }),
        finalize(() => this.store.dispatch(getTimeOffRequestAction({
          payload: { //note: we dont have proper response so we have to force refresh
            employeeIds,
            pageNumber: PAGINATION_VARS.pageNumber,
            pagesize: PAGINATION_VARS.pagesize,
            sortAscending: false,
            sortBy: "TimeOffBooking.ToDate",
            status: EmployeeRequestStatusType.Requested
          }
        })))
      ))
  ));

  getTimeOffRequestAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeOffRequestAction),
    switchMap(({ payload }) => this.timeOffService.post(payload, `/GetTimeOffBookingsForTimeOffRequests`)
      .pipe(
        map((response: ITimeOffBooking[]) => {
          return getTimeOffRequestSuccessAction({ response })
        })
      ))
  ));

  getTimeOffBalanceReportDataAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeOffBalanceReportDataAction),
    switchMap(({ payload }) => this.commonService.post(payload, `TimeOffActivity/GetTimeBalanceReportData`)
      .pipe(
        map((response: ITimeOffBalanceReport[]) => {
          return getTimeOffBalanceReportDataSuccessAction({ response });
        })
      ))
  ));

  getTimeOffPublicHolidaysAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeOffPublicHolidaysAction),
    switchMap(({ payload }) => this.commonService.post(payload, `PublicHoliday/GetPublicHolidays`)
      .pipe(
        map((response: IPublicHoliday[]) => getTimeOffPublicHolidaysSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private authService: AuthService,
    private timeOffService: TimeOffService,
    private leaveSetupService: LeaveSetupService,
    private timeOffBulkImportService: TimeOffBulkImportService,
    private commonService: CommonService) {
    super(injector);
  }
}