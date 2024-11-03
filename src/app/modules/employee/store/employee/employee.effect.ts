import { Injectable, Injector } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { finalize, filter, map, switchMap, tap, delay, startWith } from 'rxjs/operators';
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store";

import {
  calculateEmployeeDailyWageAction, calculateEmployeeDailyWageSuccessAction,
  cancelEmployeeTerminationAction, cancelEmployeeTerminationSuccessAction,
  deleteEmployeeDocumentsNotesAction, deleteEmployeeDocumentsNotesSuccessAction,
  getDocumentsNotesAction, getDocumentsNotesSuccessAction, getEmployeesAction,
  getEmployeeByIdAction, getEmployeeByIdSuccessAction,
  getEmployeesSuccessAction, updateDocumentsNotesAction,
  updateDocumentsNotesSuccessAction, updateEmployeeServiceAction,
  updateEmployeeServiceSuccessAction, updateEmployeeTakeOnAction,
  updateEmployeeTakeOnSuccessAction, updateEmployeeWorkingHoursAction,
  updateEmployeeWorkingHoursSuccessAction, updateEmployeeskillsEquityAction,
  updateEmployeeskillsEquitySuccessAction, updatePeopleEmployeeAction,
  updatePeopleEmployeeClassificationAction, updatePeopleEmployeeClassificationSuccessAction,
  updatePeopleEmployeeSuccessAction,
  performSearchEmployeesAction, performSearchEmployeesSuccessAction,
  uploadEmployeeBulkImportAction, uploadEmployeeBulkImportSuccessAction,
  getEmployeeBulkImportViewAction, getEmployeeBulkImportViewSuccessAction,
  downloadEmployeeBulkImportFileAction, downloadEmployeeBulkImportFileSuccessAction,
  quickInvitesAction,
  quickInvitesSuccessAction,
  uploadAvatarAction,
  uploadAvatarSuccessAction,
  getEmployeesWithoutSelfServiceCountAction,
  getEmployeesWithoutSelfServiceCountSuccessAction,
  getEmployeeDynamicFieldsAction,
  getEmployeeDynamicFieldsSuccessAction,
} from './employee.action';
import { CommonService } from 'src/app/services/common.service';
import { ICommonResponse } from 'src/app/models/generic.model';
import { IPeopleEmployee } from '../../../people/people.model';
import { IEmployee } from '../../employee.model';
import { DynamicFieldService, EmployeeService } from '../../employee.service';
import { GenericEffect } from 'src/app/shared/generics/notification.generic';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Injectable()
export class EmployeeEffects extends GenericEffect {
  getEmployeeDynamicFieldsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeDynamicFieldsAction),
    switchMap(({ countryId, locationId }) => this.authService.get(`/DynamicField/GetDataById/${countryId}/${locationId}`)
      .pipe(
        tap((response) => !!response),
        map((response: ICommonResponse) => getEmployeeDynamicFieldsSuccessAction({ response })),
      ))
  ));

  getEmployeesWithoutSelfServiceCountAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeesWithoutSelfServiceCountAction),
    switchMap(({ payRunId }) => this.employeeService.get(`GetEmployeesWithoutSelfServiceCount/${payRunId}`)
      .pipe(
        map((response: number) => getEmployeesWithoutSelfServiceCountSuccessAction({ response })),
      ))
  ));

  uploadAvatarAction$ = createEffect(() => this.actions$.pipe(
    ofType(uploadAvatarAction),
    switchMap(({ payload }) => this.employeeService.post(payload, '/UploadEmployeeAvatar')
      .pipe(
        map((response: ICommonResponse) => uploadAvatarSuccessAction({ response })),
        delay(300),
        finalize(() => this.store.dispatch(getEmployeeByIdAction({ id: payload.employeeId })))
      ))
  ));

  downloadEmployeeBulkImportFileAction$ = createEffect(() => this.actions$.pipe(
    ofType(downloadEmployeeBulkImportFileAction),
    switchMap(({ includeEmployeeData }) => this.commonService.get(`BulkImport/DownloadEmployeeBulkImportFile/${includeEmployeeData}`)
      .pipe(
        map((response: ICommonResponse) => downloadEmployeeBulkImportFileSuccessAction({ response }))
      ))
  ));

  getEmployeeBulkImportViewAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeBulkImportViewAction),
    switchMap(() => this.commonService.get(`BulkImport/GetEmployeeBulkImportView`)
      .pipe(
        map((response: ICommonResponse) => getEmployeeBulkImportViewSuccessAction({ response }))
      ))
  ));

  uploadEmployeeBulkImportAction$ = createEffect(() => this.actions$.pipe(
    ofType(uploadEmployeeBulkImportAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'BulkImport')
      .pipe(
        map((response: ICommonResponse) => uploadEmployeeBulkImportSuccessAction({ response })),
        delay(300),
        finalize(() => this.store.dispatch(getEmployeeBulkImportViewAction()))
      ))
  ));

  quickInvitesAction$ = createEffect(() => this.actions$.pipe(
    ofType(quickInvitesAction),
    switchMap(({ payload }) => this.employeeService.post(payload, '/invites')
      .pipe(
        tap((response) => this.getNotificationMessage(response)),
        map((response) => {
          return quickInvitesSuccessAction({ response });
        })
      ))
  ));

  performSearchEmployeesAction$ = createEffect(() => this.actions$.pipe(
    ofType(performSearchEmployeesAction),
    switchMap(({ payload }) => this.employeeService.post(payload, '/GetEmployees')
      .pipe(
        startWith([]),
        map((response: IEmployee[]) => {
          return performSearchEmployeesSuccessAction({ response });
        })
      ))
  ));

  updateEmployeeTakeOnAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeTakeOnAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'PhilippinesEmployeeTakeOn')//note: needs mex, rsa supports
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response) => {
          return updateEmployeeTakeOnSuccessAction({ response });
        })
      ))
  ));

  updateEmployeeskillsEquityAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeskillsEquityAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'employeeskillsandequity')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response) => {
          return updateEmployeeskillsEquitySuccessAction({ response });
        })
      ))
  ));

  deleteEmployeeDocumentsNotesAction$ = createEffect(() => this.actions$.pipe(
    ofType(deleteEmployeeDocumentsNotesAction),
    switchMap(({ id }) => this.commonService.deleteUsingGet(`EmployeeDocumentAndNote/DeleteNote/${id}`) //note: crazy deleting a note is GET action lol
      .pipe(
        tap((response) => this.getNotificationMessage(response)),
        map((response) => {
          return deleteEmployeeDocumentsNotesSuccessAction({ response });
        })
      ))
  ));

  getDocumentsNotesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getDocumentsNotesAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'EmployeeDocumentAndNote/GetNotesByEmployee')
      .pipe(
        map((response: ICommonResponse) => {
          return getDocumentsNotesSuccessAction({ response });
        })
      ))
  ));

  updateDocumentsNotesAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateDocumentsNotesAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'EmployeeDocumentAndNote')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => {
          return updateDocumentsNotesSuccessAction({ response });
        })
      ))
  ));

  cancelEmployeeTerminationAction$ = createEffect(() => this.actions$.pipe(
    ofType(cancelEmployeeTerminationAction),
    switchMap(({ id }) => this.commonService.deleteUsingGet(`employeeservice/${id}`)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response) => {
          return cancelEmployeeTerminationSuccessAction({ response });
        })
      ))
  ));

  updateEmployeeServiceAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeServiceAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'employeeservice/ValidateLastDayOfServiceAndReinstatementDate')
      .pipe(
        tap((response) => {
          const { errors } = response;
          if (errors?.length === 0)
            return this.commonService.post(payload, 'employeeservice')
          else
            return { errors: '' };
        }),
        tap((response) => this.getNotificationMessage(response || {})),
        map((response) => {
          return updateEmployeeServiceSuccessAction({ response });
        })
      ))
  ));

  updateEmployeeWorkingHoursAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeWorkingHoursAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'EmployeeWorkingHours')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response) => {
          return updateEmployeeWorkingHoursSuccessAction({ response });
        })
      ))
  ));

  calculateEmployeeDailyWageAction$ = createEffect(() => this.actions$.pipe(
    ofType(calculateEmployeeDailyWageAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'employeedesignation/CalculateDailyWage')
      .pipe(
        filter((response) => !!response),
        map((dailyWageResponse) => {
          return calculateEmployeeDailyWageSuccessAction({ dailyWageResponse });
        })
      ))
  ));

  updatePeopleEmployeeClassificationAction$ = createEffect(() => this.actions$.pipe(
    ofType(updatePeopleEmployeeClassificationAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'employeedesignation')
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map(() => {
          return updatePeopleEmployeeClassificationSuccessAction({ response: payload });
        })
      ))
  ));

  updatePeopleEmployeeAction$ = createEffect(() => this.actions$.pipe(
    ofType(updatePeopleEmployeeAction),
    switchMap(({ payload }) => this.employeeService.post(payload)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map(() => {
          return updatePeopleEmployeeSuccessAction({ response: payload });
        })
      ))
  ));

  getEmployeesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeesAction),
    switchMap(({ payload }) => this.employeeService.postObservePagination(payload, '/GetEmployees')
      .pipe(
        map((response) => {
          return ({
            items: response?.body,
            totalItems: JSON.parse(response?.headers?.get('pagination'))?.totalItems
          })
        }),
        map((response) => getEmployeesSuccessAction({ response }))
      ))
  ));

  getEmployeeByIdAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeByIdAction),
    switchMap(({ id }) => this.employeeService.get(`/GetEmployeeViewSetupScreen/${id}`)
      .pipe(
        map((response) => {
          return getEmployeeByIdSuccessAction({ response: <IPeopleEmployee>response });
        })
      ))
  ));

  constructor(
    private store: Store<AppState>,
    injector: Injector,
    private actions$: Actions,
    private employeeService: EmployeeService,
    private commonService: CommonService,
    private authService: AuthService,
    private dynamicFieldService: DynamicFieldService) {
    super(injector);
  }
}
