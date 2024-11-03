import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs";

import { IPublicHoliday } from "src/app/modules/time-off/time-off.model";
import { CommonService } from "src/app/services/common.service";
import { IEmployeeTimeOffActivity, IEmployeeTimeOffPolicy, ITimeOffAdjustment } from "../../employee.model";
import { deleteTimeOffAdjustmentAction, deleteTimeOffAdjustmentSuccessAction, deleteTimeOffBookingAction, deleteTimeOffBookingSuccessAction, getEmployeeLatestTimeBalanceAction, getEmployeeLatestTimeBalanceSuccessAction, getEmployeeTimeOffActivitiesAction, getEmployeeTimeOffActivitiesSuccessAction, getEmployeeTimeOffAdjustmentsAction, getEmployeeTimeOffAdjustmentsSuccessAction, getEmployeeTimeOffBookingsAction, getEmployeeTimeOffBookingsSuccessAction, getEmployeeTimeOffPolicyAction, getEmployeeTimeOffPolicySuccessAction, getEmployeeTimeOffTakeOnsAction, getEmployeeTimeOffTakeOnsSuccessAction, getEmployeesTimeOffRequestBookingsOverviewAction, getEmployeesTimeOffRequestBookingsOverviewSuccessAction, saveEmployeeTimeOffAdjustmentsAction, saveEmployeeTimeOffAdjustmentsSuccessAction, saveEmployeeTimeOffPolicyAction, saveEmployeeTimeOffPolicySuccessAction, saveEmployeeTimeOffTakeOnAction, saveEmployeeTimeOffTakeOnSuccessAction, updateEmployeeSaveTimeOffBookingAction, updateEmployeeSaveTimeOffBookingSuccessAction } from "./time-off.action";
import { ICommonResponse, IEmployeeTimeOffBookings, ILatestTimeBalance } from "src/app/models/generic.model";
import { GenericEffect } from "src/app/shared/generics/notification.generic";

@Injectable()
export class EmployeeTimeOffEffects extends GenericEffect {
  saveEmployeeTimeOffTakeOnAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveEmployeeTimeOffTakeOnAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'TimeOffTakeOn/SaveTimeOffTakeOns')
      .pipe(
        tap((response: ICommonResponse) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveEmployeeTimeOffTakeOnSuccessAction({ response }))
      ))
  ));

  getEmployeeTimeOffTakeOnsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeTimeOffTakeOnsAction),
    switchMap(({ id }) => this.commonService.get(`TimeOffTakeOn/GetTimeOffTakeOns/${id}`)
      .pipe(
        map((response) => {
          return getEmployeeTimeOffTakeOnsSuccessAction({ response: response?.timeOffTakeOnItems });
        })
      ))
  ));

  saveEmployeeTimeOffPolicyAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveEmployeeTimeOffPolicyAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'EmployeeTimeOffPolicy/Save')
      .pipe(
        tap((response: ICommonResponse) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveEmployeeTimeOffPolicySuccessAction({ response }))
      ))
  ));

  getEmployeeTimeOffPolicyAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeTimeOffPolicyAction),
    switchMap(({ id }) => this.commonService.get(`EmployeeTimeOffPolicy/${id}`)
      .pipe(
        map((response: IEmployeeTimeOffPolicy[]) => {
          return getEmployeeTimeOffPolicySuccessAction({ response });
        })
      ))
  ));

  deleteTimeOffAdjustmentAction$ = createEffect(() => this.actions$.pipe(
    ofType(deleteTimeOffAdjustmentAction),
    switchMap(({ id }) => this.commonService.delete(`timeoffadjustment/Delete/${id}`)
      .pipe(
        tap((response: ICommonResponse) => this.getNotificationMessage(response || {})),
        map((response) => {
          return deleteTimeOffAdjustmentSuccessAction({ response });
        })
      ))
  ));

  saveEmployeeTimeOffAdjustmentsAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveEmployeeTimeOffAdjustmentsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'timeoffadjustment/SaveTimeOffAdjustments')
      .pipe(
        tap((response: ICommonResponse) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => {
          return saveEmployeeTimeOffAdjustmentsSuccessAction({ response });
        })
      ))
  ));

  getEmployeeTimeOffAdjustmentsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeTimeOffAdjustmentsAction),
    switchMap(({ id }) => this.commonService.get(`timeoffadjustment/GetTimeOffAdjustments/${id}`)
      .pipe(
        map((response: ITimeOffAdjustment[]) => {
          return getEmployeeTimeOffAdjustmentsSuccessAction({ response });
        })
      ))
  ));

  deleteTimeOffBookingAction$ = createEffect(() => this.actions$.pipe(
    ofType(deleteTimeOffBookingAction),
    switchMap(({ id }) => this.commonService.delete(`TimeOffBooking/Delete/${id}`)
      .pipe(
        tap((response: ICommonResponse) => this.getNotificationMessage(response || {}, 'Deleted Succesfully')),
        map((response) => {
          return deleteTimeOffBookingSuccessAction({ response });
        })
      ))
  ));

  updateEmployeeSaveTimeOffBookingAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeSaveTimeOffBookingAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'TimeOffBooking/SaveTimeOffBooking')
      .pipe(
        tap((response: ICommonResponse) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => {
          return updateEmployeeSaveTimeOffBookingSuccessAction({ response });
        })
      ))
  ));

  getEmployeeTimeOffBookingsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeTimeOffBookingsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'TimeOffBooking/GetTimeOffBookings')
      .pipe(
        map((response: IEmployeeTimeOffBookings) => {
          return getEmployeeTimeOffBookingsSuccessAction({ response });
        })
      ))
  ));

  getEmployeeLatestTimeBalanceAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeLatestTimeBalanceAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'TimeOffActivity/GetLatestTimeBalances')
      .pipe(
        map((response: ILatestTimeBalance[]) => {
          return getEmployeeLatestTimeBalanceSuccessAction({ response });
        })
      ))
  ));

  getEmployeesTimeOffRequestBookingsOverviewAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeesTimeOffRequestBookingsOverviewAction),
    switchMap(({ payload }) => this.commonService.post(payload, `TimeOffBooking/GetTimeOffBookingsForTimeOffRequestsForTimeOffOverView`)
      .pipe(
        map((response: IPublicHoliday[]) => {
          return getEmployeesTimeOffRequestBookingsOverviewSuccessAction({ response });
        })
      ))
  ));

  getEmployeeTimeOffActivitiesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeTimeOffActivitiesAction),
    switchMap(({ id }) => this.commonService.post({ employeeId: id }, `TimeOffActivity/GetTimeOffActivities`)
      .pipe(
        map((response: IEmployeeTimeOffActivity[]) => {
          return getEmployeeTimeOffActivitiesSuccessAction({ response });
        })
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private commonService: CommonService) {
    super(injector);
  }
}