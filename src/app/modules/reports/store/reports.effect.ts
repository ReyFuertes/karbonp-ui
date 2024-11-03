import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { finalize, map, switchMap, tap } from "rxjs";

import { downloadBalanceReportsAction, downloadBalanceReportsSuccessAction, getBalancesReportsAction, getBalancesReportsSuccessAction, downloadSkillsEquityReportReportsAction, downloadSkillsEquityReportReportsSuccessAction, getSkillsEquityReportReportsAction, getSkillsEquityReportReportsSuccessAction, getInformationReportsAction, getInformationReportsSuccessAction, downloadInformationReportsAction, downloadInformationReportsSuccessAction, getCurrentTaxPeriodAction, getCurrentTaxPeriodSuccessAction, getReportsColumnAction, getReportsColumnSuccessAction, getReportsDetailedPayrollTemplatesAction, getReportsDetailedPayrollTemplatesSuccessAction, getReportsDataAction, getReportsDataSuccessAction, downloadDetailedReportsAction, downloadDetailedReportsSuccessAction, saveTemplateReportsAction, saveTemplateReportsSuccessAction, getMonthlySettingReportsAction, getMonthlySettingReportsSuccessAction, saveMonthlySettingReportsAction, saveMonthlySettingReportsSuccessAction } from "./reports.action";
import { ICommonResponse } from "src/app/models/generic.model";
import { CommonService, TaxService } from "src/app/services/common.service";
import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { IMonthlySettingReport, IReportDataResponse, IReportResponse, ISaveTemplateReportReponse } from "../reports.model";
import { IEmployeeSkillsEquity } from "../../employee/employee.model";
import { EmployeeService } from "../../employee/employee.service";
import { ReportsService, ReportTemplateService } from "../reports.service";
import { Store } from "@ngrx/store";
import { AppState } from ".";

@Injectable()
export class ReportsEffect extends GenericEffect {
  saveMonthlySettingReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveMonthlySettingReportsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'monthlyreportsettings')
      .pipe(
        tap((response) => this.getNotificationMessage(response)),
        map((response: IMonthlySettingReport) => saveMonthlySettingReportsSuccessAction({ response }))
      ))
  ));

  getMonthlySettingReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getMonthlySettingReportsAction),
    switchMap(() => this.commonService.get('monthlyreportsettings')
      .pipe(
        map((response: IMonthlySettingReport) => getMonthlySettingReportsSuccessAction({ response }))
      ))
  ));

  saveTemplateReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveTemplateReportsAction),
    switchMap(({ payload }) => this.reportTemplateService.post(payload, '/SaveTemplate')
      .pipe(
        map((response: ICommonResponse) => saveTemplateReportsSuccessAction({ response })),
        finalize(() => {
          this.store.dispatch(getCurrentTaxPeriodAction());
          this.store.dispatch(getReportsColumnAction());
          this.store.dispatch(getReportsDetailedPayrollTemplatesAction());
        })
      ))
  ));

  downloadDetailedReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadDetailedReportsAction),
    switchMap(({ payload }) => this.reportsService.post(payload, '/GenerateDetailedPayrollExcelExport')
      .pipe(
        map((response: ICommonResponse) => downloadDetailedReportsSuccessAction({ response })),
        finalize(() => localStorage.setItem('detailedReportsPayload', JSON.stringify(payload)))
      ))
  ));

  getReportsDataAction$ = createEffect(() => this.actions$.pipe(
    ofType(getReportsDataAction),
    switchMap(({ payload }) => this.reportsService.post(payload, '/GetReportData')
      .pipe(
        map((response: IReportDataResponse) => {
          return getReportsDataSuccessAction({ response })
        })
      ))
  ));

  getReportsDetailedPayrollTemplatesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getReportsDetailedPayrollTemplatesAction),
    switchMap(() => this.reportTemplateService.get('')
      .pipe(
        map((response: ISaveTemplateReportReponse[]) => getReportsDetailedPayrollTemplatesSuccessAction({ response }))
      ))
  ));

  getReportsColumnAction$ = createEffect(() => this.actions$.pipe(
    ofType(getReportsColumnAction),
    switchMap(() => this.reportsService.get('/GetReportColumns')
      .pipe(
        map((response: string[]) => getReportsColumnSuccessAction({ response }))
      ))
  ));

  getCurrentTaxPeriodAction$ = createEffect(() => this.actions$.pipe(
    ofType(getCurrentTaxPeriodAction),
    switchMap(() => this.taxService.get('/GetCurrentTaxPeriodDates')
      .pipe(
        map((response: ICommonResponse) => getCurrentTaxPeriodSuccessAction({ response }))
      ))
  ));

  downloadInformationReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadInformationReportsAction),
    switchMap(({ payload }) => this.employeeService.post(payload, '/GenerateEmployeeInfoReportExcelExport')
      .pipe(
        map((response: ICommonResponse) => downloadInformationReportsSuccessAction({ response })),
        finalize(() => localStorage.setItem('informationReportsPayload', JSON.stringify(payload)))
      ))
  ));

  getInformationReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getInformationReportsAction),
    switchMap(({ payload }) => this.employeeService.post(payload, '/GetEmployeesForEmployeeInfoReport')
      .pipe(
        map((response: IReportResponse[]) => getInformationReportsSuccessAction({ response })),
        finalize(() => localStorage.setItem('informationReportsPayload', JSON.stringify(payload)))
      ))
  ));

  getSkillsEquityReportReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getSkillsEquityReportReportsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'employeeskillsandequity/GetEmployeeSkillsAndEquities')
      .pipe(
        map((response: IEmployeeSkillsEquity[]) => {
          return getSkillsEquityReportReportsSuccessAction({ response })
        }),
        finalize(() => localStorage.setItem('skillsEquityReportsPayload', JSON.stringify(payload)))
      ))
  ));

  downloadSkillsEquityReportReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadSkillsEquityReportReportsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'employeeskillsandequity/GenerateSkillsAndEquityExcelExport')
      .pipe(
        map((response: ICommonResponse) => downloadSkillsEquityReportReportsSuccessAction({ response }))
      ))
  ));

  downloadBalanceReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadBalanceReportsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'PayRun/GenerateBalancesReportExcelExport') //note: refactor use global service
      .pipe(
        map((response: ICommonResponse) => downloadBalanceReportsSuccessAction({ response }))
      ))
  ));

  getBalancesReportsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getBalancesReportsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'PayRun/GetBalancesLoansSavingsAndGarnisheesForBalancesReport') //note: refactor use global service
      .pipe(
        map((response: IReportResponse) => getBalancesReportsSuccessAction({ response: <IReportResponse>response })),
        finalize(() => localStorage.setItem('balancesReportsPayload', JSON.stringify(payload)))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private commonService: CommonService,
    private taxService: TaxService,
    private reportTemplateService: ReportTemplateService,
    private reportsService: ReportsService,
    private employeeService: EmployeeService) {
    super(injector);
  }
}