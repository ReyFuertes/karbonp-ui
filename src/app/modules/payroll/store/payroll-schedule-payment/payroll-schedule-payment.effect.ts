import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { ICommonResponse } from "src/app/models/generic.model";
import { getSchedulePaymentSetupDataAction, getSchedulePaymentSetupDataSuccessAction, saveSchedulePaymentAction, saveSchedulePaymentSuccessAction } from "./payroll-schedule-payment.action";
import { PayRunPaymentService } from "../../payroll.service";

@Injectable()
export class PayrollPaymentScheduleEffect extends GenericEffect {
  saveSchedulePaymentAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveSchedulePaymentAction),
    switchMap(({ payload }) => this.payRunPaymentService.post(payload, `/SchedulePayment`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveSchedulePaymentSuccessAction({ response }))
      ))
  ));

  getSchedulePaymentSetupDataAction$ = createEffect(() => this.actions$.pipe(
    ofType(getSchedulePaymentSetupDataAction),
    switchMap(({ payRunId }) => this.payRunPaymentService.get(`/GetSchedulePaymentSetupData/${payRunId}`)
      .pipe(
        map((response: ICommonResponse) => getSchedulePaymentSetupDataSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private payRunPaymentService: PayRunPaymentService) {
    super(injector);
  }
}