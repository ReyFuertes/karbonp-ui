import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { AppState } from "..";
import { ICommonResponse } from "src/app/models/generic.model";
import { getPayrollSettingsCalculationsAction, getPayrollSettingsCalculationsSuccessAction, savePayrollSettingsCalculationsAction, savePayrollSettingsCalculationsSuccessAction } from "./payroll-settings-calculations.action";
import { PayrollCalculationService } from "../../payroll.service";

@Injectable()
export class PayrollSettingsCalculationsEffect extends GenericEffect {
  getPayrollSettingsCalculationsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollSettingsCalculationsAction),
    switchMap(() => this.payrollCalculationService.get()
      .pipe(
        map((response: ICommonResponse) => getPayrollSettingsCalculationsSuccessAction({ response }))
      ))
  ));

  savePayrollSettingsCalculationsAction$ = createEffect(() => this.actions$.pipe(
    ofType(savePayrollSettingsCalculationsAction),
    switchMap(({ payload }) => this.payrollCalculationService.post(payload)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => savePayrollSettingsCalculationsSuccessAction({ response })),
        // finalize(() => this.store.dispatch(getPayrollSettingsPayslipsAction()))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private payrollCalculationService: PayrollCalculationService) {
    super(injector);
  }
}