import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { finalize, map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { PayslipSetupService } from "../../payroll.service";
import { getPayrollSettingsPayslipsAction, getPayrollSettingsPayslipsSuccessAction, savePayrollSettingsPayslipsAction, savePayrollSettingsPayslipsSuccessAction } from "./payroll-settings-payslip.action";
import { IPayslipSetup } from "../../payroll.model";
import { AppState } from "..";

@Injectable()
export class PayrollSettingsPaySlipSetupEffect extends GenericEffect {
  savePayrollSettingsPayslipsAction$ = createEffect(() => this.actions$.pipe(
    ofType(savePayrollSettingsPayslipsAction),
    switchMap(({ payload }) => this.payslipSetupService.post(payload)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: IPayslipSetup) => savePayrollSettingsPayslipsSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayrollSettingsPayslipsAction()))
      ))
  ));

  getPayrollSettingsPayslipsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollSettingsPayslipsAction),
    switchMap(() => this.payslipSetupService.get()
      .pipe(
        map((response: IPayslipSetup) => getPayrollSettingsPayslipsSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private payslipSetupService: PayslipSetupService) {
    super(injector);
  }
}