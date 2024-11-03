import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { combineLatest, delay, finalize, map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { GoalGetterService, PayRunService, PublicHolidayService } from "../../payroll.service";
import { applyGoalGetterNetAmountAction, applyGoalGetterNetAmountSuccessAction, approvePayrunPayslipsAction, approvePayrunPayslipsSuccessAction, approveRevertPayslipAction, approveRevertPayslipSuccessAction, calculateGoalGetterNetAmountAction, calculateGoalGetterNetAmountActionSuccessAction, completeInProgressPayRunAction, completeInProgressPayRunSuccessAction, createCustomPayrunAction, createCustomPayrunSuccessAction, deletePayRunAction, deletePayRunSuccessAction, downloadBulkPayRunsAction, downloadBulkPayRunsSuccessAction, generateGoalGetterPaySlipPDFAction, generateGoalGetterPaySlipPDFActionSuccessAction, generatePDFPaySlipAction, generatePDFPaySlipSuccessAction, getBeneficiariesAction, getBeneficiariesSuccessAction, getEmployeeActivityLoggingAction, getEmployeeActivityLoggingSuccessAction, getEmployeeRetirementFundingAction, getEmployeeRetirementFundingActionSuccessAction, getPayrollEmployeeHoursAction, getPayrollEmployeeHoursSuccessAction, getPayrollEmployeeSetupDataAction, getPayrollEmployeeSetupDataSuccessAction, getPayrollPayTypeAction, getPayrollPayTypeSuccessAction, getPayRunEmployeesAction, getPayRunEmployeesSuccessAction, getPayrunInProgressAction, getPayrunInProgressSuccessAction, getPayrunSetupDataAction, getPayrunSetupDataSuccessAction, getPayslipPreviewAction, getPayslipPreviewSuccessAction, getPublicHolidaysByPayRunAction, getPublicHolidaysByPayRunSuccessAction, getRestDaysForEmployeeAction, getRestDaysForEmployeeSuccessAction, getTimeAndAttendanceAction, getTimeAndAttendanceSuccessAction, reCalculatePayRunPayslipsAction, reCalculatePayRunPayslipsSuccessAction, releasePayRunAction, releasePayRunSuccessAction, saveBasicSalaryAction, saveBasicSalarySuccessAction, updatePayslipProRataPercentageAction, updatePayslipProRataPercentageSuccessAction, validateForInabilityToCompletePayRunAction, validateForInabilityToCompletePayRunSuccessAction } from "./payroll-payrun-in-progress.action";
import { IBeneficiary, ICustomPaytype, ICalculatedGoalGetter, IPayrunInProgress } from "../../payroll.model";
import { AppState } from "..";
import { ICommonResponse, IEmployeeActivityLog } from "src/app/models/generic.model";
import { CommonService } from "src/app/services/common.service";
import { EmployeeService } from "src/app/modules/employee/employee.service";
import { TimeAndAttendanceService } from "src/app/services/time-attendance.service";
import { IPublicHoliday } from "src/app/modules/time-off/time-off.model";
import { PAGINATION_VARS } from "src/app/shared/constants/generic.constant";

@Injectable()
export class PayrollPayrunInProgressEffect extends GenericEffect {
  releasePayRunAction$ = createEffect(() => this.actions$.pipe(
    ofType(releasePayRunAction),
    switchMap(({ payRunId, cultureLang }) => this.payRunService.get(`/ReleasePayRun/${payRunId}/${cultureLang}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Payrun released successfully')),
        map((response: ICommonResponse) => releasePayRunSuccessAction({ response }))
      ))
  ));

  reCalculatePayRunPayslipsAction$ = createEffect(() => this.actions$.pipe(
    ofType(reCalculatePayRunPayslipsAction),
    switchMap(({ payRunId }) => this.payRunService.get(`/RecalculatePayRunPayslips/${payRunId}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Recalculate Successfull')),
        map((response: ICommonResponse) => reCalculatePayRunPayslipsSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayrunInProgressAction({ //note: need to set pagination properly
          payload: {
            pageNumber: PAGINATION_VARS.pageNumber,
            pagesize: PAGINATION_VARS.pagesize,
            sortBy: '', sortAscending: true,
            payFrequencyId: null
          }
        })))
      ))
  ));

  deletePayRunAction$ = createEffect(() => this.actions$.pipe(
    ofType(deletePayRunAction),
    switchMap(({ payRunId }) => this.payRunService.delete(`/DeletePayRun/${payRunId}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Successfully Deleted')),
        map((response: ICommonResponse) => deletePayRunSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayrunInProgressAction({ //note: need to set pagination properly
          payload: { pageNumber: 1, pagesize: 100, sortBy: '', sortAscending: true, payFrequencyId: null }
        })))
      ))
  ));

  getTimeAndAttendanceAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTimeAndAttendanceAction),
    switchMap(() => this.timeAttendanceService.get()
      .pipe(
        map((response: ICommonResponse) => getTimeAndAttendanceSuccessAction({ response }))
      ))
  ));

  getPublicHolidaysByPayRunAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPublicHolidaysByPayRunAction),
    switchMap(({ payRunId }) => this.publicHolidayService.get(`/GetPublicHolidayByPayRun/${payRunId}`)
      .pipe(
        map((response: IPublicHoliday[]) => getPublicHolidaysByPayRunSuccessAction({ response }))
      ))
  ));

  getRestDaysForEmployeeAction$ = createEffect(() => this.actions$.pipe(
    ofType(getRestDaysForEmployeeAction),
    switchMap(({ employeeId, payRunId }) => this.timeAttendanceService.get(`/GetRestDaysForEmployee/${employeeId}/${payRunId}`)
      .pipe(
        map((response: ICommonResponse) => getRestDaysForEmployeeSuccessAction({ response }))
      ))
  ));

  applyGoalGetterNetAmountAction$ = createEffect(() => this.actions$.pipe(
    ofType(applyGoalGetterNetAmountAction),
    switchMap(({ payload, employeeId, payRunId }) => this.goalGetterService.post(payload, `/ApplyGoalGetterNetAmount`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Apply Successfull')),
        map((response: ICommonResponse) => {
          return applyGoalGetterNetAmountSuccessAction({ response });
        }),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId, payRunId })))
      ))
  ));

  generateGoalGetterPaySlipPDFAction$ = createEffect(() => this.actions$.pipe(
    ofType(generateGoalGetterPaySlipPDFAction),
    switchMap(({ payload }) => this.goalGetterService.post(payload, `/GenerateGoalGetterPaySlipPDF`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Successfully Downloaded')),
        map((response: ICommonResponse) => {
          return generateGoalGetterPaySlipPDFActionSuccessAction({ response, payslipId: payload?.payslipId });
        })
      ))
  ));

  calculateGoalGetterNetAmountAction$ = createEffect(() => this.actions$.pipe(
    ofType(calculateGoalGetterNetAmountAction),
    switchMap(({ payload }) => this.goalGetterService.post(payload, `/CalculateGoalGetterNetAmount`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Calculated Successfully')),
        map((response: ICalculatedGoalGetter) => {
          return calculateGoalGetterNetAmountActionSuccessAction({ response });
        })
      ))
  ));

  getEmployeeRetirementFundingAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeRetirementFundingAction),
    switchMap(({ employeeId }) => this.commonService.get(`employeeretirementfundingincome/GetEmployeeRetirementFundingIncome/${employeeId}`)
      .pipe(
        map((response: ICommonResponse) => {
          return getEmployeeRetirementFundingActionSuccessAction({ response });
        })
      ))
  ));

  getPayrollPayTypeAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollPayTypeAction),
    switchMap(({ payTypeId }) => this.commonService.get(`customitem/${payTypeId}`)
      .pipe(
        map((response: ICustomPaytype) => {
          return getPayrollPayTypeSuccessAction({ response });
        })
      ))
  ));

  getBeneficiariesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getBeneficiariesAction),
    switchMap(({ payload }) => this.commonService.post(payload, `beneficiary/GetBeneficiaries`)
      .pipe(
        map((response: IBeneficiary[]) => {
          return getBeneficiariesSuccessAction({ response });
        })
      ))
  ));

  saveBasicSalaryAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveBasicSalaryAction),
    switchMap(({ payload, employeeId, payRunId }) => this.commonService.post(payload, `PayrollInput/SaveBasicSalary`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveBasicSalarySuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayrollEmployeeSetupDataAction({ employeeId, payRunId }))) //note: no api proper response needs refresh
      ))
  ));

  public getPayrollEmployeeHoursAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollEmployeeHoursAction),
    switchMap(({ employeeId }) => combineLatest([
      this.employeeService.get(`/EmployeeWorkingHours/${employeeId}`),
      this.employeeService.get(`/employeedesignation/${employeeId}`),
      this.commonService.get(`payrollcalculation/getDefaultPayrollCalculationSettings`), //note: refactor, mote to its own service
      this.commonService.get(`payrollcalculation`) //note: refactor, mote to its own service
    ]).pipe(
      map(([employeeWorkingHour, employeeDesignation, payrollCalculationSettings, payrollcalculations]) => {
        return getPayrollEmployeeHoursSuccessAction({ employeeWorkingHour, employeeDesignation, payrollCalculationSettings, payrollcalculations });
      })
    ))
  ));

  getPayslipPreviewAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayslipPreviewAction),
    switchMap(({ employeeId, payRunId }) => this.payRunService.get(`/GetPayslipPreview/${employeeId}/${payRunId}`)
      .pipe(
        map((response: ICommonResponse) => {
          return getPayslipPreviewSuccessAction({ response });
        })
      ))
  ));

  approveRevertPayslipAction$ = createEffect(() => this.actions$.pipe(
    ofType(approveRevertPayslipAction),
    switchMap(({ payload, employeePayRun }) => this.payRunService.post(payload, `/ApprovePayslips`)
      .pipe(
        map((response: ICommonResponse) => approveRevertPayslipSuccessAction({ response })),
        delay(300),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ //note: needs refresh -_-
          employeeId: employeePayRun?.employeeId, payRunId: employeePayRun?.payRunId
        })))
      ))
  ));

  getEmployeeActivityLoggingAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeActivityLoggingAction),
    switchMap(({ payload }) => this.commonService.post(payload, `EmployeeActivityLogging/GetEmployeeActivityLogs`)
      .pipe(
        map((response: IEmployeeActivityLog[]) => getEmployeeActivityLoggingSuccessAction({ response }))
      ))
  ));

  updatePayslipProRataPercentageAction$ = createEffect(() => this.actions$.pipe(
    ofType(updatePayslipProRataPercentageAction),
    switchMap(({ payload }) => this.payRunService.post({
      payslipId: payload?.id,
      proRataOverridePercentage: payload?.proRataOverridePercentage
    }, `/UpdatePayslipProRataPercentage`)
      .pipe(
        map((response: ICommonResponse) => {
          return updatePayslipProRataPercentageSuccessAction({ response });
        }),
        delay(300),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ //note: we dont have proper api response so we need to refresh the whole payslip
          employeeId: payload?.employeeId, payRunId: payload?.payRunId
        })))
      ))
  ));

  getPayrollEmployeeSetupDataAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollEmployeeSetupDataAction),
    switchMap(({ employeeId, payRunId }) => combineLatest([
      this.payRunService.get(`/GetPayrollEmployeeSetupData/${employeeId}/${payRunId}`),
      this.payRunService.get(`/GetPayslipPreview/${employeeId}/${payRunId}`),
    ]).pipe(
      map(([employeeSetupData, payslipPreview]) => {
        return getPayrollEmployeeSetupDataSuccessAction({ employeeSetupData, payslipPreview });
      })
    ))
  ));

  completeInProgressPayRunAction$ = createEffect(() => this.actions$.pipe(
    ofType(completeInProgressPayRunAction),
    switchMap(({ payload }) => combineLatest([
      this.payRunService.post(payload, `/CompletePayRun`),
      this.employeeService.get(`GetEmployeesWithoutSelfServiceCount/${payload?.payRunId}`)
    ]).pipe(
      tap(([response]) => this.getNotificationMessage(response || {}, 'Payrun Completed')),
      map(([response, selfServiceEnabledCount]) => completeInProgressPayRunSuccessAction({ response, selfServiceEnabledCount })),
      finalize(() => {
        this.store.dispatch(getPayrunInProgressAction({
          payload: {
            pageNumber: PAGINATION_VARS.pageNumber, //note: hardcoded get from settings maybe
            pagesize: PAGINATION_VARS.pagesize,
            sortBy: 'ToDate',
            sortAscending: true,
            payFrequencyId: null
          }
        }));
      })
    ))
  ));

  validateForInabilityToCompletePayRunAction$ = createEffect(() => this.actions$.pipe(
    ofType(validateForInabilityToCompletePayRunAction),
    switchMap(({ id }) => this.payRunService.get(`/ValidateForInabilityToCompletePayRun/${id}`)
      .pipe(
        map((response: ICommonResponse) => {
          return validateForInabilityToCompletePayRunSuccessAction({ response });
        })
      ))
  ));

  generatePDFPaySlipAction$ = createEffect(() => this.actions$.pipe(
    ofType(generatePDFPaySlipAction),
    switchMap(({ employeeId, payRunId }) => this.payRunService.get(`/GeneratePDFPaySlip/${employeeId}/en/${payRunId}`)//note: change language culture
      .pipe(
        map((response: ICommonResponse) => {
          return generatePDFPaySlipSuccessAction({ employeeId: employeeId, response });
        })
      ))
  ));

  downloadBulkPayRunsAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadBulkPayRunsAction),
    switchMap(({ payload }) => this.payRunService.post(payload, `/GenerateBulkPDFPaySlips`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Successfully Downloaded')),
        map((response: ICommonResponse) => downloadBulkPayRunsSuccessAction({ response }))
      ))
  ));

  createCustomPayrunAction$ = createEffect(() => this.actions$.pipe(
    ofType(createCustomPayrunAction),
    switchMap(({ payload }) => this.payRunService.post(payload, '/SaveCustomPayRun')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: IPayrunInProgress) => createCustomPayrunSuccessAction({ response })),
        delay(300),
        finalize(() => this.store.dispatch(getPayrunInProgressAction({ //note: there we're missing properties in the response like e.g totalPendingPayslips, so we need to call the
          payload: { pageNumber: 1, pagesize: 100, sortBy: '', sortAscending: true, payFrequencyId: null }
        })))
      ))
  ));

  approvePayrunPayslipsAction$ = createEffect(() => this.actions$.pipe(
    ofType(approvePayrunPayslipsAction),
    switchMap(({ id, payload }) => this.payRunService.get(`/GetPayRunEmployees/${id}`)
      .pipe(
        switchMap(() => this.payRunService.post(payload, '/ApprovePayslips')),
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: IPayrunInProgress[]) => approvePayrunPayslipsSuccessAction({ response }))
      ))
  ));

  getPayRunEmployeesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayRunEmployeesAction),
    switchMap(({ payload }) => this.payRunService.post(payload, '/GetPayRunEmployees')
      .pipe(
        map((response: IPayrunInProgress[]) => getPayRunEmployeesSuccessAction({ response }))
      ))
  ));

  getPayrunSetupDataAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrunSetupDataAction),
    switchMap(({ id }) => combineLatest([
      this.payRunService.get(`/GetPayRunSetupData/${id}`),
      this.payRunService.post({
        employeeIds: null,
        payRunId: id,
        payslipStatus: null,
        sortAscending: true,
        sortBy: "LastName"
      }, `/GetPayRunEmployees`)
    ]).pipe(
      map(([setupData, payRunEmployees]) => getPayrunSetupDataSuccessAction({ setupData, payRunEmployees }))
    ))
  ));

  getPayrunInProgressAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrunInProgressAction),
    switchMap(({ payload }) => this.payRunService.postObservePagination(payload, '/GetPayRunsInProgress')
      .pipe(
        map((response) => {
          return ({
            items: response?.body,
            totalItems: JSON.parse(response?.headers?.get('pagination'))?.totalItems
          })
        }),
        map((response) => getPayrunInProgressSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private store: Store<AppState>,
    private actions$: Actions,
    private router: Router,
    private commonService: CommonService,
    private payRunService: PayRunService,
    private goalGetterService: GoalGetterService,
    private timeAttendanceService: TimeAndAttendanceService,
    private publicHolidayService: PublicHolidayService,
    private employeeService: EmployeeService) {
    super(injector);
  }
}