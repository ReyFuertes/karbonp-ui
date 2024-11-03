import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { finalize, map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { PayRunService } from "../../payroll.service";
import { generatePayRunExcelExportAction, generatePayRunExcelExportSuccessAction, generatePayRunPDFExportAction, generatePayRunPDFExportSuccessAction, getPayrunCompletedAction, getPayrunCompletedSuccessAction, undoPayRunCompletePayrunAction, undoPayRunCompletePayrunSuccessAction } from "./payroll-payruns-completed.action";
import { ICommonResponse } from "src/app/models/generic.model";
import { AppState } from "..";
import { getPayrunInProgressAction } from "../payrun-in-progress/payroll-payrun-in-progress.action";

@Injectable()
export class PayrollPayrunCompletedEffect extends GenericEffect {
  undoPayRunCompletePayrunAction$ = createEffect(() => this.actions$.pipe(
    ofType(undoPayRunCompletePayrunAction),
    switchMap(({ payRunId }) => this.payRunService.get(`/UndoPayRun/${payRunId}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {}, 'Completed payrun undo successfull')),
        map((response: ICommonResponse) => undoPayRunCompletePayrunSuccessAction({ response, payRunId })),
        finalize(() => {
          this.store.dispatch(getPayrunCompletedAction({ payload: this.payload }));
          this.store.dispatch(getPayrunInProgressAction({
            payload: Object.assign({}, this.payload, { sortBy: 'ToDate' })
          }));
        })
      ))
  ));

  generatePayRunPDFExportAction$ = createEffect(() => this.actions$.pipe(
    ofType(generatePayRunPDFExportAction),
    switchMap(({ payRunId, cultureLang, methodType }) => this.payRunService.get(`/GeneratePayRunPDFExport/${payRunId}/${cultureLang}/${methodType}`)
      .pipe(
        map((response: ICommonResponse) => generatePayRunPDFExportSuccessAction({ response, payRunId }))
      ))
  ));

  generatePayRunExcelExportAction$ = createEffect(() => this.actions$.pipe(
    ofType(generatePayRunExcelExportAction),
    switchMap(({ payRunId, cultureLang, methodType }) => this.payRunService.get(`/GeneratePayRunExcelExport/${payRunId}/${cultureLang}/${methodType}`)
      .pipe(
        map((response: ICommonResponse) => generatePayRunExcelExportSuccessAction({ response, payRunId }))
      ))
  ));
  //note: reformat the response so it can handle the pagination
  getPayrunCompletedAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrunCompletedAction),
    switchMap(({ payload }) => this.payRunService.postObservePagination(payload, '/GetPayRunsCompleted')
      .pipe(
        map((response) => {
          return ({
            items: response?.body,
            totalItems: JSON.parse(response?.headers?.get('pagination'))?.totalItems
          })
        }),
        map((response) => {
          return getPayrunCompletedSuccessAction({ response });
        })
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private payRunService: PayRunService) {
    super(injector);
  }
}