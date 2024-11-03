import { createAction, props } from '@ngrx/store';

import { IEmployee, IEmployeeService, IEmployeeSkillsEquity, IEmployeeTakeOn, IEmployeeWorkingHour } from '../../employee.model';
import { ICommonResponse, IDesignationPayload, IDocumentNote } from 'src/app/models/generic.model';
import { IPeopleEmployee, IEmployeePaginationPayload } from '../../../people/people.model';

export enum EmployeeTypes {
  clearEmployeesEntitiesAction = '[Employee] clear employees entities',
  setEmployeeLoadingAction = '[Employee] set employees loading',
  getEmployeesAction = '[Employee] get employees',
  getEmployeesSuccessAction = '[Employee] get employees (success)',
  getEmployeeByIdAction = '[Employee] get employee by id',
  getEmployeeByIdSuccessAction = '[Employee] get employee by id (success)',
  selectPeopleEmployeeByIdAction = '[Employee] select employee by id',
  clearSelectEmployeeAction = '[Employee] clear selected employee',
  updatePeopleEmployeeAction = '[Employee] update employee',
  updatePeopleEmployeeSuccessAction = '[Employee] update employee (success)',
  updatePeopleEmployeeClassificationAction = '[Employee] update employee designation',
  updatePeopleEmployeeClassificationSuccessAction = '[Employee] update employee designation (success)',
  calculateEmployeeDailyWageAction = '[Employee] calculate daily wage',
  calculateEmployeeDailyWageSuccessAction = '[Employee] calculate daily wage (success)',
  updateEmployeeWorkingHoursAction = '[Employee] update employee working hours',
  updateEmployeeWorkingHoursSuccessAction = '[Employee] update employee working hours (success)',
  updateEmployeeServiceAction = '[Employee] update employee service',
  updateEmployeeServiceSuccessAction = '[Employee] update employee service (success)',
  cancelEmployeeTerminationAction = '[Employee] cancel employee termination',
  cancelEmployeeTerminationSuccessAction = '[Employee] cancel employee termination (success)',
  updateDocumentsNotesAction = '[Employee] update documents notes',
  updateDocumentsNotesSuccessAction = '[Employee] update documents notes (success)',
  getDocumentsNotesAction = '[Employee] get documents notes',
  getDocumentsNotesSuccessAction = '[Employee] get documents notes (success)',
  deleteEmployeeDocumentsNotesAction = '[Employee] delete documents notes',
  deleteEmployeeDocumentsNotesSuccessAction = '[Employee] delete documents notes (success)',
  updateEmployeeskillsEquityAction = '[Employee] update employees skills Equity',
  updateEmployeeskillsEquitySuccessAction = '[Employee] update employees skills Equity (success)',
  updateEmployeeTakeOnAction = '[Employee] update employee take on',
  updateEmployeeTakeOnSuccessAction = '[Employee] update employee take on (success)',
  performSearchEmployeesAction = '[Employee] perform search employees',
  performSearchEmployeesSuccessAction = '[Employee] perform search employees (success)',
  uploadAvatarAction = '[Employee] upload avatar',
  uploadAvatarSuccessAction = '[Employee] upload avatar (success)',
  quickInvitesAction = '[Employee] quick invite',
  quickInvitesSuccessAction = '[Employee] quick invite (success)',
  clearInvitedEmployeesAction = '[Employee] clear quick invite',
  uploadEmployeeBulkImportAction = '[Employee] save time off bulk import',
  uploadEmployeeBulkImportSuccessAction = '[Employee] save employee bulk import (success)',
  getEmployeeBulkImportViewAction = '[Employee] get employee bulk import view',
  getEmployeeBulkImportViewSuccessAction = '[Employee] employee bulk import view (success)',
  downloadEmployeeBulkImportFileAction = '[Employee] download employee bulk import file',
  downloadEmployeeBulkImportFileSuccessAction = '[Employee] download employee bulk import file (success)',
  getEmployeesWithoutSelfServiceCountAction = '[Employee] get employees without self service count',
  getEmployeesWithoutSelfServiceCountSuccessAction = '[Employee] get employees without self service count (success)',
  getEmployeeDynamicFieldsAction = '[Employee] get employee dynamic fields',
  getEmployeeDynamicFieldsSuccessAction = '[Employee] get employee dynamic fields (success)',

}
export const getEmployeeDynamicFieldsAction = createAction(
  EmployeeTypes.getEmployeeDynamicFieldsAction,
  props<{ countryId: number, locationId: number }>()
);
export const getEmployeeDynamicFieldsSuccessAction = createAction(
  EmployeeTypes.getEmployeeDynamicFieldsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getEmployeesWithoutSelfServiceCountAction = createAction(
  EmployeeTypes.getEmployeesWithoutSelfServiceCountAction,
  props<{ payRunId: number }>()
);
export const getEmployeesWithoutSelfServiceCountSuccessAction = createAction(
  EmployeeTypes.getEmployeesWithoutSelfServiceCountSuccessAction,
  props<{ response: number }>() //note: why number?
);
export const downloadEmployeeBulkImportFileAction = createAction(
  EmployeeTypes.downloadEmployeeBulkImportFileAction,
  props<{ includeEmployeeData: boolean }>()
);
export const downloadEmployeeBulkImportFileSuccessAction = createAction(
  EmployeeTypes.downloadEmployeeBulkImportFileSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getEmployeeBulkImportViewAction = createAction(
  EmployeeTypes.getEmployeeBulkImportViewAction
);
export const getEmployeeBulkImportViewSuccessAction = createAction(
  EmployeeTypes.getEmployeeBulkImportViewSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const uploadEmployeeBulkImportAction = createAction(
  EmployeeTypes.uploadEmployeeBulkImportAction,
  props<{ payload: { file: string, reCalculatePayslips: boolean } }>()
);
export const uploadEmployeeBulkImportSuccessAction = createAction(
  EmployeeTypes.uploadEmployeeBulkImportSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const clearInvitedEmployeesAction = createAction(
  EmployeeTypes.clearInvitedEmployeesAction
);
export const quickInvitesAction = createAction(
  EmployeeTypes.quickInvitesAction,
  props<{ payload: IEmployee[] }>()
);
export const quickInvitesSuccessAction = createAction(
  EmployeeTypes.quickInvitesSuccessAction,
  props<{ response: IEmployee[] }>()
);
export const uploadAvatarAction = createAction(
  EmployeeTypes.uploadAvatarAction,
  props<{ payload: { employeeId: number, fileName: string, image: string } }>()
);
export const uploadAvatarSuccessAction = createAction(
  EmployeeTypes.uploadAvatarSuccessAction,
  props<{ response: any }>()
);
export const performSearchEmployeesAction = createAction(
  EmployeeTypes.performSearchEmployeesAction,
  props<{ payload: IEmployeePaginationPayload }>()
);
export const performSearchEmployeesSuccessAction = createAction(
  EmployeeTypes.performSearchEmployeesSuccessAction,
  props<{ response: IEmployee[] }>()
);
export const updateEmployeeTakeOnAction = createAction(
  EmployeeTypes.updateEmployeeTakeOnAction,
  props<{ payload: IEmployeeTakeOn }>()
);
export const updateEmployeeTakeOnSuccessAction = createAction(
  EmployeeTypes.updateEmployeeTakeOnSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const updateEmployeeskillsEquityAction = createAction(
  EmployeeTypes.updateEmployeeskillsEquityAction,
  props<{ payload: IEmployeeSkillsEquity }>()
);
export const updateEmployeeskillsEquitySuccessAction = createAction(
  EmployeeTypes.updateEmployeeskillsEquitySuccessAction,
  props<{ response: ICommonResponse }>()
);
export const deleteEmployeeDocumentsNotesAction = createAction(
  EmployeeTypes.deleteEmployeeDocumentsNotesAction,
  props<{ id: string }>()
);
export const deleteEmployeeDocumentsNotesSuccessAction = createAction(
  EmployeeTypes.deleteEmployeeDocumentsNotesSuccessAction,
  props<{ response: any }>()
);
export const getDocumentsNotesAction = createAction(
  EmployeeTypes.getDocumentsNotesAction,
  props<{
    payload: {
      categoryId?: number,
      employeeId: string;
      pageNumber: number,
      pagesize: number,
      sortAscending: boolean,
      sortBy: string;
    }
  }>()
);
export const getDocumentsNotesSuccessAction = createAction(
  EmployeeTypes.getDocumentsNotesSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const updateDocumentsNotesAction = createAction(
  EmployeeTypes.updateDocumentsNotesAction,
  props<{ payload: IDocumentNote }>()
);
export const updateDocumentsNotesSuccessAction = createAction(
  EmployeeTypes.updateDocumentsNotesSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const cancelEmployeeTerminationAction = createAction(
  EmployeeTypes.cancelEmployeeTerminationAction,
  props<{ id: string }>()
);
export const cancelEmployeeTerminationSuccessAction = createAction(
  EmployeeTypes.cancelEmployeeTerminationSuccessAction,
  props<{ response: any }>()
);
export const updateEmployeeServiceAction = createAction(
  EmployeeTypes.updateEmployeeServiceAction,
  props<{ payload: IEmployeeService }>()
);
export const updateEmployeeServiceSuccessAction = createAction(
  EmployeeTypes.updateEmployeeServiceSuccessAction,
  props<{ response: IEmployeeService }>()
);
export const updateEmployeeWorkingHoursAction = createAction(
  EmployeeTypes.updateEmployeeWorkingHoursAction,
  props<{ payload: IEmployeeWorkingHour }>()
)
export const updateEmployeeWorkingHoursSuccessAction = createAction(
  EmployeeTypes.updateEmployeeWorkingHoursSuccessAction,
  props<{ response: any }>()
);
export const calculateEmployeeDailyWageAction = createAction(
  EmployeeTypes.calculateEmployeeDailyWageAction,
  props<{ payload: { employeeId: number, paymentAmount: number, paymentType: number } }>()
);
export const calculateEmployeeDailyWageSuccessAction = createAction(
  EmployeeTypes.calculateEmployeeDailyWageSuccessAction,
  props<{ dailyWageResponse: { data: number } }>()
);
export const updatePeopleEmployeeClassificationAction = createAction(
  EmployeeTypes.updatePeopleEmployeeClassificationAction,
  props<{ payload: IDesignationPayload }>()
);
export const updatePeopleEmployeeClassificationSuccessAction = createAction(
  EmployeeTypes.updatePeopleEmployeeClassificationSuccessAction,
  props<{ response: any }>()
);
export const updatePeopleEmployeeAction = createAction(
  EmployeeTypes.updatePeopleEmployeeAction,
  props<{ payload: IEmployee }>()
);
export const updatePeopleEmployeeSuccessAction = createAction(
  EmployeeTypes.updatePeopleEmployeeSuccessAction,
  props<{ response: IEmployee }>()
);
export const selectPeopleEmployeeByIdAction = createAction(
  EmployeeTypes.selectPeopleEmployeeByIdAction,
  props<{ id: number }>()
);
export const clearSelectEmployeeAction = createAction(
  EmployeeTypes.clearSelectEmployeeAction
);
export const getEmployeesAction = createAction(
  EmployeeTypes.getEmployeesAction,
  props<{ payload: IEmployeePaginationPayload }>()
);
export const getEmployeesSuccessAction = createAction(
  EmployeeTypes.getEmployeesSuccessAction,
  props<{ response: { items: IEmployee[], totalItems: number } }>()
);
export const getEmployeeByIdAction = createAction(
  EmployeeTypes.getEmployeeByIdAction,
  props<{ id: number }>()
);
export const getEmployeeByIdSuccessAction = createAction(
  EmployeeTypes.getEmployeeByIdSuccessAction,
  props<{ response: IPeopleEmployee | any }>() //note: any lol
);
export const setEmployeeLoadingAction = createAction(
  EmployeeTypes.setEmployeeLoadingAction,
  props<{ loading: boolean }>()
);
export const clearEmployeesEntitiesAction = createAction(
  EmployeeTypes.clearEmployeesEntitiesAction
);
