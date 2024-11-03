import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { finalize, map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { PayrollCalculationService, PayrollInputService } from "../../payroll.service";
import { deleteNotesAction, deletePayrollInputAction, deletePayrollInputSuccessAction, getBasicSalaryPayrollInputAction, getBasicSalaryPayrollInputSuccessAction, getDeductionPayrollInputAction, getDeductionPayrollInputSuccessAction, getPayPointByEmployeeIdAction, getPayPointByEmployeeIdSuccessAction, getPayrollCalculationSetupAction, getPayrollCalculationSetupSuccessAction, getRelevantPhilippinesRegulatedSettingAction, getRelevantPhilippinesRegulatedSettinguccessAction, getSelectedPayrollInputsAction, getSelectedPayrollInputSuccessAction, saveBenefitInputAction, saveBenefitInputSuccessAction, saveDailyWeeklyBreakdownHoursSalaryAction, saveDailyWeeklyBreakdownHoursSalarySuccessAction, saveDeductionInputAction, saveDeductionInputSuccessAction, saveIncomeInputAction, saveIncomeInputSuccessAction, saveNotesAction, saveNotesSuccessAction, saveOtherInputAction, saveOtherInputSuccessAction, saveRecurringInputAllowanceAction, saveRecurringInputAllowanceSuccessAction } from "./payroll-input.action";
import { ICommonResponse } from "src/app/models/generic.model";
import { AppState } from "..";
import { getPayrollEmployeeHoursAction, getPayslipPreviewAction } from "../payrun-in-progress/payroll-payrun-in-progress.action";
import { IAllowanceInput, IBenefitInput, IDeductionInput, IIncomeInput, IOtherInput, IPayrollInput } from "../../payroll.model";
import { CommonService } from "src/app/services/common.service";

@Injectable()
export class PayrollPayrunInputEffect extends GenericEffect {
  saveDailyWeeklyBreakdownHoursSalaryAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveDailyWeeklyBreakdownHoursSalaryAction),
    switchMap(({ payload }) => this.payrollInputService.post(payload, '/SaveDailyWeeklyBreakdownHoursSalary')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveDailyWeeklyBreakdownHoursSalarySuccessAction({ response })),
        finalize(() => {
          this.store.dispatch(getPayrollEmployeeHoursAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }));
          this.store.dispatch(getBasicSalaryPayrollInputAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }));
        })
      ))
  ));

  getBasicSalaryPayrollInputAction$ = createEffect(() => this.actions$.pipe(
    ofType(getBasicSalaryPayrollInputAction),
    switchMap(({ employeeId, payRunId }) => this.payrollInputService.get(`/GetBasicSalaryPayrollInput/${payRunId}/${employeeId}`)
      .pipe(
        map((response: { payrollInput: IPayrollInput }) => getBasicSalaryPayrollInputSuccessAction({ response }))
      ))
  ));

  saveIncomeInputAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveIncomeInputAction),
    switchMap(({ payload }) => this.payrollInputService.post(payload, '/SaveRecurringInputIncome')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: IIncomeInput) => saveIncomeInputSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }))) //note: no proper return we need to refresh
      ))
  ));

  getPayrollCalculationSetupAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollCalculationSetupAction),
    switchMap(() => this.payrollCalculationService.get()
      .pipe(
        map((response) => {
          return getPayrollCalculationSetupSuccessAction({ response });
        })
      ))
  ));

  getPayPointByEmployeeIdAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayPointByEmployeeIdAction),
    switchMap(({ employeeId }) => this.commonService.get(`paypoint/GetPayPointByEmployeeId/${employeeId}`)
      .pipe(
        map((response) => {
          return getPayPointByEmployeeIdSuccessAction({ response });
        })
      ))
  ));

  getRelevantPhilippinesRegulatedSettingAction$ = createEffect(() => this.actions$.pipe(
    ofType(getRelevantPhilippinesRegulatedSettingAction),
    switchMap(({ payRunId }) => this.commonService.get(`PhilippinesRegulatedSettings/GetRelevantPhilippinesRegulatedSettings/${payRunId}`)
      .pipe(
        map((response) => {
          return getRelevantPhilippinesRegulatedSettinguccessAction({ response });
        })
      ))
  ));

  deletePayrollInputAction$ = createEffect(() => this.actions$.pipe(
    ofType(deletePayrollInputAction),
    switchMap(({ id, employeeId, payRunId }) => this.payrollInputService.delete(`/${id}/${payRunId}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Successfully Deleted')),
        map((response: ICommonResponse) => deletePayrollInputSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId, payRunId }))) //note: no proper return we need to refresh
      ))
  ));

  saveDeductionInputAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveDeductionInputAction),
    switchMap(({ payload }) => this.payrollInputService.post(payload, '/SaveRecurringInputDeduction')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: IDeductionInput) => saveDeductionInputSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }))) //note: no proper return we need to refresh
      ))
  ));

  saveOtherInputAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveOtherInputAction),
    switchMap(({ payload }) => this.payrollInputService.post(payload, '/SaveRecurringInputOther')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: IOtherInput) => saveOtherInputSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }))) //note: no proper return we need to refresh
      ))
  ));

  saveBenefitInputAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveBenefitInputAction),
    switchMap(({ payload }) => this.payrollInputService.post(payload, '/SaveRecurringInputBenefit')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: IBenefitInput) => saveBenefitInputSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }))) //note: no proper return we need to refresh
      ))
  ));

  saveRecurringInputAllowanceAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveRecurringInputAllowanceAction),
    switchMap(({ payload }) => this.payrollInputService.post(payload, '/SaveRecurringInputAllowance')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: IAllowanceInput) => saveRecurringInputAllowanceSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }))) //note: no proper return we need to refresh
      ))
  ));

  getSelectedPayrollInputsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getSelectedPayrollInputsAction),
    switchMap(({ payrollInputId, payRunId }) => this.payrollInputService.get(`/${payrollInputId}/${payRunId}`)
      .pipe(
        map((response) => {
          return getSelectedPayrollInputSuccessAction({ response });
        })
      ))
  ));

  deleteNotesAction$ = createEffect(() => this.actions$.pipe(
    ofType(deleteNotesAction),
    switchMap(({ payload }) => this.payrollInputService.delete(`/DeleteNotes/${payload?.id}/${payload?.isPrivateNote}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveNotesSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }))) //note: no proper return we need to refresh
      ))
  ));

  saveNotesAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveNotesAction),
    switchMap(({ payload }) => this.payrollInputService.post(payload, '/SaveNotes')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveNotesSuccessAction({ response })),
        finalize(() => this.store.dispatch(getPayslipPreviewAction({ employeeId: payload?.employeeId, payRunId: payload?.payRunId }))) //note: no proper return we need to refresh
      ))
  ));

  getDeductionPayrollInputAction$ = createEffect(() => this.actions$.pipe(
    ofType(getDeductionPayrollInputAction),
    switchMap(({ payrollInputId, payRunId }) => this.payrollInputService.get(`/GetDeductionPayrollInput/${payrollInputId}/${payRunId}`) //note: why separate endpoint with getSelectedPayrollInputsAction?
      .pipe(
        map((response) => {
          return getDeductionPayrollInputSuccessAction({ response });
        })
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private commonService: CommonService,
    private payrollInputService: PayrollInputService,
    private payrollCalculationService: PayrollCalculationService) {
    super(injector);
  }
}