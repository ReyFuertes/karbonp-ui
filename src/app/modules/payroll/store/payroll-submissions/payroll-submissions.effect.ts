import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { combineLatest, finalize, map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { getPayrollTaxSubmissionsAction, getPayrollTaxSubmissionsSuccessAction, getPayrollMonhtlyEmp201SubmissionsAction, getPayrollMonthlyEmp201SubmissionsSuccessAction, getPayrollMonthlyUIFSubmissionsAction, getPayrollMonthlyUIFSubmissionsSuccessAction, getAnnualIRP5IT3ASubmissionsAction, getAnnualIRP5IT3ASubmissionsSuccessAction, getIncomeAndBenefitTypesSubmissionsAction, getIncomeAndBenefitTypesSubmissionsSuccessAction, getPhilippinesMonthlySubmissionsAction, getPhilippinesMonthlySubmissionsSuccessAction, downloadPhilippinesSubmissionsAction, downloadPhilippinesSubmissionsSuccessAction, get1601CDataSubmissionsAction, get1601CDataSubmissionsSuccessAction, generateUser1601CPDFSubmissionsAction, generateUser1601CPDFSubmissionsSuccessAction, generateEMP201PdfSubmissionsAction, generateEMP201PdfSubmissionsSuccessAction, completeEMP201SubmissionsAction, completeEMP201SubmissionsSuccessAction, submitUIFSubmissionsAction, submitUIFSubmissionsSuccessAction, generateUIFPDFSubmissionsAction, generateUIFPDFSubmissionsSuccessAction, filingDetailsSetupSubmissionsAction, filingDetailsSetupSubmissionsSuccessAction, generateIRP5IT3ASubmissionsAction, generateIRP5IT3ASubmissionsSuccessAction, getEmployeesWithPayRunDataSubmissionsAction, getEmployeesWithPayRunDataSubmissionsSuccessAction, generateAnnualizationReportSubmissionsAction, generateAnnualizationReportSubmissionsSuccessAction, generateAlphalistSchedule1ReportSubmissionsAction, generateAlphalistSchedule1ReportSubmissionsSuccessAction, generateCOIDAReportSubmissionsAction, generateCOIDAReportSubmissionsSuccessAction, southAfricaRegulatedSettingsSubmissionsAction, southAfricaRegulatedSettingsSubmissionsSuccessAction, validateIRP5IT3ASubmissionsAction, validateIRP5IT3ASubmissionsSuccessAction, finalizeIRP5IT3ASubmissionsAction, finalizeIRP5IT3ASubmissionsSuccessAction, generateIRP5EasyfileExportSubmissionsAction, generateIRP5EasyfileExportSubmissionsSuccessAction, generateEMP501PDFSubmissionsAction, generateEMP501PDFSubmissionsSuccessAction } from "./payroll-submissions.action";
import { IFillingSetup, IMonthlyEmp201Submission, IMonthlyUifSubmission, ITaxSeason, IValidateIRP5IT3ASubmission } from "../../payroll.model";
import { AnnualizationReportService, FilingDetailsSetupService, PhilippinesSubmissionsService, SubmissionsService, TaxService } from "../../payroll.service";
import { ICommonResponse } from "src/app/models/generic.model";
import { AppState } from "..";
import { CommonService } from "src/app/services/common.service";

@Injectable()
export class PayrollSubmissionsEffect extends GenericEffect {
  generateEMP501PDFSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateEMP501PDFSubmissionsAction),
    switchMap(({ payload }) => this.submissionsService.post(payload, `/GenerateEMP501SubmissionPDF`)
      .pipe(
        map((response: ICommonResponse) => generateEMP501PDFSubmissionsSuccessAction({ response, keyDates: `${payload?.fromDate}${payload?.toDate}` }))
      ))
  ));

  generateIRP5EasyfileExportSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateIRP5EasyfileExportSubmissionsAction),
    switchMap(({ payload }) => this.annualizationReportService.post(payload, `/GenerateAlphalistSchedule1Report`)
      .pipe(
        map((response: ICommonResponse) => generateIRP5EasyfileExportSubmissionsSuccessAction({ response, keyDates: `${payload?.fromDate}${payload?.toDate}` }))
      ))
  ));

  finalizeIRP5IT3ASubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(finalizeIRP5IT3ASubmissionsAction),
    switchMap(({ payload }) => this.submissionsService.post(payload, `/FinalizeIRP5IT3ASubmission`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Finalize IRP5IT3A successfull')), //note: should throw proper error, (errorMessage: "Failed to finalise all submissions")
        map((response: ICommonResponse) => finalizeIRP5IT3ASubmissionsSuccessAction({ response })),
        finalize(() => this.store.dispatch(getAnnualIRP5IT3ASubmissionsAction({ payload })))
      ))
  ));

  //note: we need this later?
  validateIRP5IT3ASubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(validateIRP5IT3ASubmissionsAction),
    switchMap(({ payload }) => this.commonService.post(payload, `ValidateIRP5IT3ASubmissions`)
      .pipe(
        map((response: IValidateIRP5IT3ASubmission[]) => validateIRP5IT3ASubmissionsSuccessAction({ response }))
      ))
  ));

  southAfricaRegulatedSettingsSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(southAfricaRegulatedSettingsSubmissionsAction),
    switchMap(({ regulatedSettingsId }) => this.commonService.get(`SouthAfricaRegulatedSettings/${regulatedSettingsId}`)
      .pipe(
        map((response: ICommonResponse) => southAfricaRegulatedSettingsSubmissionsSuccessAction({ response }))
      ))
  ));

  generateCOIDAReportSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateCOIDAReportSubmissionsAction),
    switchMap(({ payload }) => this.submissionsService.post(payload, `/GenerateCOIDAReport`)
      .pipe(
        map((response: ICommonResponse) => generateCOIDAReportSubmissionsSuccessAction({ response, keyDates: `${payload?.fromDate}${payload?.toDate}` }))
      ))
  ));

  generateAlphalistSchedule1ReportSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateAlphalistSchedule1ReportSubmissionsAction),
    switchMap(({ payload }) => this.annualizationReportService.post(payload, `/GenerateAlphalistSchedule1Report`)
      .pipe(
        map((response: ICommonResponse) => generateAlphalistSchedule1ReportSubmissionsSuccessAction({ response, keyDates: `${payload?.fromDate}${payload?.toDate}` }))
      ))
  ));

  generateAnnualizationReportSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateAnnualizationReportSubmissionsAction),
    switchMap(({ payload }) => this.annualizationReportService.post(payload, `/GenerateAnnualizationReport`)
      .pipe(
        map((response: ICommonResponse) => generateAnnualizationReportSubmissionsSuccessAction({ response, keyDates: `${payload?.fromDate}${payload?.toDate}` }))
      ))
  ));

  getEmployeesWithPayRunDataSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeesWithPayRunDataSubmissionsAction),
    switchMap(({ payload }) => this.philippinesSubmissionsService.postObservePagination(payload, '/GetEmployeesWithPayRunData')
      .pipe(
        map((response) => this.getPagination(response)),
        map((response) => {
          return getEmployeesWithPayRunDataSubmissionsSuccessAction({ response });
        })
      ))
  ));

  generateIRP5IT3ASubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateIRP5IT3ASubmissionsAction),
    switchMap(({ payload }) => this.submissionsService.post(payload, `/GenerateIRP5IT3ASubmissionPDF`)
      .pipe(
        map((response: ICommonResponse) => generateIRP5IT3ASubmissionsSuccessAction({ response, employeeId: payload?.employeeId }))
      ))
  ));

  filingDetailsSetupSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(filingDetailsSetupSubmissionsAction),
    switchMap(() => this.filingDetailsSetupService.get()
      .pipe(
        map((response: IFillingSetup) => filingDetailsSetupSubmissionsSuccessAction({ response }))
      ))
  ));

  generateUIFPDFSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateUIFPDFSubmissionsAction),
    switchMap(({ submissionId, language }) => this.submissionsService.get(`/GenerateUIFSubmissionPDF/${submissionId}/${language}`)
      .pipe(
        map((response: ICommonResponse) => generateUIFPDFSubmissionsSuccessAction({ response, submissionId }))
      ))
  ));

  submitUIFSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(submitUIFSubmissionsAction),
    switchMap(({ submissionId }) => this.submissionsService.get(`/SubmitUIFSubmission/${submissionId}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Submission Completed successfull')),
        map((response: ICommonResponse) => submitUIFSubmissionsSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayrollMonthlyUIFSubmissionsAction()))
      ))
  ));

  completeEMP201SubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(completeEMP201SubmissionsAction),
    switchMap(({ submissionId }) => this.submissionsService.get(`/CompleteEMP201Submission/${submissionId}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Submission Completed successfull')),
        map((response: ICommonResponse) => completeEMP201SubmissionsSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayrollMonhtlyEmp201SubmissionsAction()))
      ))
  ));

  generateEMP201PdfSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateEMP201PdfSubmissionsAction),
    switchMap(({ submissionId, language }) => this.submissionsService.get(`/GenerateEMP201SubmissionPDF/${submissionId}/${language}`)
      .pipe(
        map((response: ICommonResponse) => generateEMP201PdfSubmissionsSuccessAction({ response, submissionId }))
      ))
  ));

  generateUser1601CPDFSubmissionsSuccessAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateUser1601CPDFSubmissionsAction),
    switchMap(({ payload }) => this.philippinesSubmissionsService.post(payload, '/GenerateUser1601CPDF')
      .pipe(
        map((response: ICommonResponse) => generateUser1601CPDFSubmissionsSuccessAction({ response, submissionMonth: payload?.submissionMonth }))
      ))
  ));

  get1601CDataSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(get1601CDataSubmissionsAction),
    switchMap(({ payload }) => this.philippinesSubmissionsService.post(payload, '/Get1601CData')
      .pipe(
        map((response: ICommonResponse) => get1601CDataSubmissionsSuccessAction({ response }))
      ))
  ));

  downloadPhilippinesSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadPhilippinesSubmissionsAction),
    switchMap(({ payload }) => this.philippinesSubmissionsService.post(payload, `/DownloadPdf`)
      .pipe(
        map((response: ICommonResponse) => downloadPhilippinesSubmissionsSuccessAction({
          response,
          reportDate: payload?.reportDate,
          submissionDocumentType: payload?.submissionDocumentType
        }))
      ))
  ));

  getPhilippinesMonthlySubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPhilippinesMonthlySubmissionsAction),
    switchMap(() => this.philippinesSubmissionsService.get('/GetMonthlySubmissions')
      .pipe(
        map((response: ICommonResponse) => getPhilippinesMonthlySubmissionsSuccessAction({ response }))
      ))
  ));

  getIncomeAndBenefitTypesSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getIncomeAndBenefitTypesSubmissionsAction),
    switchMap(() => this.submissionsService.get('/GetIncomeAndBenefitTypes')
      .pipe(
        map((response: ICommonResponse) => getIncomeAndBenefitTypesSubmissionsSuccessAction({ response }))
      ))
  ));

  getAnnualIRP5IT3ASubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getAnnualIRP5IT3ASubmissionsAction),
    switchMap(({ payload }) => combineLatest([
      this.submissionsService.post(payload, '/GetIRP5IT3ASubmissions'),
      this.submissionsService.post(payload, '/ValidateIRP5IT3ASubmissions')
    ]).pipe(
      map(([IIrp5Summission, validateIRP5IT3A]) => getAnnualIRP5IT3ASubmissionsSuccessAction({ response: { IIrp5Summission, validateIRP5IT3A } }))
    ))
  ));

  getPayrollTaxSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollTaxSubmissionsAction),
    switchMap(() => this.taxService.get('/GetTaxSeasons')
      .pipe(
        map((response: ITaxSeason[]) => getPayrollTaxSubmissionsSuccessAction({ response }))
      ))
  ));

  getPayrollMonthlyUIFSubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollMonthlyUIFSubmissionsAction),
    switchMap(() => this.submissionsService.get('/GetMonthlyUIFSubmissions')
      .pipe(
        map((response: IMonthlyUifSubmission[]) => getPayrollMonthlyUIFSubmissionsSuccessAction({ response }))
      ))
  ));

  getPayrollMonhtlyEmp201SubmissionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollMonhtlyEmp201SubmissionsAction),
    switchMap(() => this.submissionsService.get('/GetMonthlyEMP201Submissions')
      .pipe(
        map((response: IMonthlyEmp201Submission[]) => getPayrollMonthlyEmp201SubmissionsSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private taxService: TaxService,
    private commonService: CommonService,
    private submissionsService: SubmissionsService,
    private filingDetailsSetupService: FilingDetailsSetupService,
    private annualizationReportService: AnnualizationReportService,
    private philippinesSubmissionsService: PhilippinesSubmissionsService) {
    super(injector);
  }
}