import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { PayFrequencyService } from "../../payroll.service";
import { calculateDateRangesAction, calculateDateRangesSuccessAction, getPayrollSettingsPayPeriodsAction, getPayrollSettingsPayPeriodsSuccessAction, savePayPeriodAction, savePayPeriodSuccessAction } from "./payroll-settings-pay-period.action";
import { IPayPeriodDateRange } from "../../payroll.model";
import { ICommonResponse } from "src/app/models/generic.model";

@Injectable()
export class PayrollPayrunPayPeriodEffect extends GenericEffect {
  savePayPeriodAction$ = createEffect(() => this.actions$.pipe(
    ofType(savePayPeriodAction),
    switchMap(({ payload }) => this.payFrequencyService.post(payload)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => savePayPeriodSuccessAction({ response }))
      ))
  ));

  calculateDateRangesAction$ = createEffect(() => this.actions$.pipe(
    ofType(calculateDateRangesAction),
    switchMap(({ payload }) => this.payFrequencyService.post(payload, `/CalculateDateRanges`)
      .pipe(
        map((response: IPayPeriodDateRange[]) => calculateDateRangesSuccessAction({ response }))
      ))
  ));

  getPayrollSettingsPayPeriodsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollSettingsPayPeriodsAction),
    switchMap(({ payload }) => this.payFrequencyService.postObservePagination(payload, '/GetPayFrequencies')
      .pipe(
        map((response) => this.getPagination(response)),
        map((response) => {
          return getPayrollSettingsPayPeriodsSuccessAction({ response });
        })
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private payFrequencyService: PayFrequencyService) {
    super(injector);
  }
}