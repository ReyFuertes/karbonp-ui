import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { PayslipSetupService } from "../../payroll.service";
import { IBankSetup } from "../../payroll.model";
import { AppState } from "..";
import { getPayrollSettingsBanksAction, getPayrollSettingsBanksSuccessAction, getPayrollSettingsBankTypesAction, getPayrollSettingsBankTypesSuccessAction, savePayrollSettingsBankAction, savePayrollSettingsBankSuccessAction } from "./payroll-settings-bank.action";
import { CommonService } from "src/app/services/common.service";
import { ICommonResponse } from "src/app/models/generic.model";

@Injectable()
export class PayrollSettingsBankEffect extends GenericEffect {
  savePayrollSettingsBankAction$ = createEffect(() => this.actions$.pipe(
    ofType(savePayrollSettingsBankAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'eftsetup')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => savePayrollSettingsBankSuccessAction({ response }))
      ))
  ));

  getPayrollSettingsBankTypesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollSettingsBankTypesAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'bankaccounttype/GetBankAccountTypes')
      .pipe(
        map((response: IBankSetup[]) => getPayrollSettingsBankTypesSuccessAction({ response }))
      ))
  ));

  getPayrollSettingsBanksAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollSettingsBanksAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'bank/GetBanks')
      .pipe(
        map((response: IBankSetup[]) => getPayrollSettingsBanksSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private commonService: CommonService,
    private payslipSetupService: PayslipSetupService) {
    super(injector);
  }
}