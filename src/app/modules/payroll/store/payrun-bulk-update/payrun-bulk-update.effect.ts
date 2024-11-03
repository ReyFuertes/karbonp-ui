import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { delay, finalize, map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { BulkPayRunUpdateService } from "../../payroll.service";
import { applyBulkPayRunUpdateAction, applyBulkPayRunUpdateSuccessAction, downloadBulkHoursUpdateExcelAction, downloadBulkHoursUpdateExcelSuccessAction, downloadBulkUpdateExcelAction, downloadBulkUpdateExcelSuccessAction, getBulkPayRunUpdateOptionsAction, getBulkPayRunUpdateOptionsSuccessAction, getPayrollSetupDataAction, getPayrollSetupDataSuccessAction, getPayRunBulkHoursImportViewAction, getPayRunBulkHoursImportViewSuccessAction, getPayRunBulkImportViewAction, getPayRunBulkImportViewSuccessAction, getPayRunEmployeeDataAction, getPayRunEmployeeDataSuccessAction, uploadPayrollBulkImportUpdateAction, uploadPayrollBulkImportUpdateSuccessAction } from "./payrun-bulk-update.action";
import { ICommonResponse } from "src/app/models/generic.model";
import { IEmployee } from "src/app/modules/employee/employee.model";
import { AppState } from "..";

@Injectable()
export class PayrollPayrunBulkUpdateEffect extends GenericEffect {
  getPayRunBulkHoursImportViewAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayRunBulkHoursImportViewAction),
    switchMap(({ payRunId }) => this.bulkPayRunUpdateService.get(`/GetPayRunBulkImportView/${payRunId}`)
      .pipe(
        map((response: ICommonResponse) => getPayRunBulkHoursImportViewSuccessAction({ response }))
      ))
  ));

  downloadBulkHoursUpdateExcelAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadBulkHoursUpdateExcelAction),
    switchMap(({ payload }) => this.bulkPayRunUpdateService.post(payload, `/DownloadBulkHoursUpdateExcel`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Successfully Downloaded')),
        map((response: ICommonResponse) => downloadBulkHoursUpdateExcelSuccessAction({ response }))
      ))
  ));

  getBulkPayRunUpdateOptionsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getBulkPayRunUpdateOptionsAction),
    switchMap(({ payRunId }) => this.bulkPayRunUpdateService.get(`/GetBulkPayRunUpdateOptions/${payRunId}`)
      .pipe(
        map((response: ICommonResponse) => getBulkPayRunUpdateOptionsSuccessAction({ response }))
      ))
  ));

  getPayRunBulkImportViewAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayRunBulkImportViewAction),
    switchMap(({ payRunId }) => this.bulkPayRunUpdateService.get(`/GetPayRunBulkImportView/${payRunId}`)
      .pipe(
        map((response: ICommonResponse) => getPayRunBulkImportViewSuccessAction({ response }))
      ))
  ));

  uploadPayrollBulkImportUpdateAction$ = createEffect(() => this.actions$.pipe(
    ofType(uploadPayrollBulkImportUpdateAction),
    switchMap(({ payload, payRunId }) => this.bulkPayRunUpdateService.post(payload, `/BulkImport`)
      .pipe(
        map((response: ICommonResponse) => uploadPayrollBulkImportUpdateSuccessAction({ response })),
        delay(300),//note: we need to look into the api asynchronousity
        finalize(() => this.store.dispatch(getPayRunBulkImportViewAction({ payRunId })))
      ))
  ))

  downloadBulkUpdateExcelAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadBulkUpdateExcelAction),
    switchMap(({ payload }) => this.bulkPayRunUpdateService.post(payload, `/DownloadBulkUpdateExcel`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Successfully Downloaded')),
        map((response: ICommonResponse) => downloadBulkUpdateExcelSuccessAction({ response }))
      ))
  ));

  applyBulkPayRunUpdateAction$ = createEffect(() => this.actions$.pipe(
    ofType(applyBulkPayRunUpdateAction),
    switchMap(({ payload, payRunId }) => this.bulkPayRunUpdateService.post(payload, `/ApplyBulkPayRunUpdate`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => applyBulkPayRunUpdateSuccessAction({ response })),
        delay(3000), //note: api asynchronousity problem
        finalize(() => this.store.dispatch(getPayRunEmployeeDataAction({
          payload: { employeeIds: payload?.map(employee => employee?.id), language: 'en', payPointIds: [], payRunId }
        })))
      ))
  ));

  getPayRunEmployeeDataAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayRunEmployeeDataAction),
    switchMap(({ payload }) => this.bulkPayRunUpdateService.post(payload, `/getPayRunEmployeeData`)
      .pipe(
        map((response: IEmployee[]) => getPayRunEmployeeDataSuccessAction({ response }))
      ))
  ));

  getPayrollSetupDataAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollSetupDataAction),
    switchMap(({ payRunId }) => this.bulkPayRunUpdateService.get(`/GetPayrollSetupData/${payRunId}`)
      .pipe(
        map((response: ICommonResponse) => getPayrollSetupDataSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private bulkPayRunUpdateService: BulkPayRunUpdateService) {
    super(injector);
  }
}