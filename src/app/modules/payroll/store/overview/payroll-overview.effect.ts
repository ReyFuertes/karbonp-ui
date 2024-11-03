import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { delay, finalize, map, switchMap } from "rxjs";
import { Store } from "@ngrx/store";

import { getGrossSalariesByMonthForFinancialYearAction, getGrossSalariesByMonthForFinancialYearSuccessAction, getPayrollEftSetupAction, getPayrollEftSetupSuccessAction, getPayRunsPerMonthOverviewAction, getPayRunsPerMonthOverviewSuccessAction } from "./payroll-overview.action";
import { CommonService } from "src/app/services/common.service";
import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { IEtfSetup, IGetPayRunsPerMonthOverview, IGrossSalaryByMonthlyFinancialYear } from "../../payroll.model";
import { AppState } from "src/app/store";
import { getTodoListWidgetDataAction } from "src/app/store/app.action";

@Injectable()
export class PayrollOverViewEffect extends GenericEffect {
  getPayrollEftSetupAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollEftSetupAction),
    switchMap(() => this.commonService.get('eftsetup')
      .pipe(
        map((response: IEtfSetup) => getPayrollEftSetupSuccessAction({ response }))
      ))
  ));

  getGrossSalariesByMonthForFinancialYearAction$ = createEffect(() => this.actions$.pipe(
    ofType(getGrossSalariesByMonthForFinancialYearAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'HomeDashboard/GetGrossSalariesByMonthForFinancialYear')
      .pipe(
        map((response: IGrossSalaryByMonthlyFinancialYear[]) => getGrossSalariesByMonthForFinancialYearSuccessAction({ response }))
      ))
  ));

  getPayRunsPerMonthOverviewAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayRunsPerMonthOverviewAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'HomeDashboard/GetPayRunsPerMonthOverview')
      .pipe(
        map((response: IGetPayRunsPerMonthOverview) => getPayRunsPerMonthOverviewSuccessAction({ response })),
        delay(1000),
        finalize(() => this.store.dispatch(getTodoListWidgetDataAction()))
      ))
  ));

  constructor(
    injector: Injector,
    private store: Store<AppState>,
    private actions$: Actions,
    private commonService: CommonService) {
    super(injector);
  }
}