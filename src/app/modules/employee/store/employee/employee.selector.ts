import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EmployeeModuleState } from '..';
import { IDocumentNote } from 'src/app/models/generic.model';
import { IEmployee } from '../../employee.model';
import { sortByDesc } from 'src/app/shared/util/sort';

export const selectEmployeeModuleState = createFeatureSelector<EmployeeModuleState>('employeeModule');
export const getEmployeeDynamicFieldsSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeDynamicFields);
export const getemployeesWithoutSelfServiceCountSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.invitedEmployees);
export const getInvitedEmployeesSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.invitedEmployees);
export const getSearchedEmployeesSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.searchedEmployees);
export const getPhilippinesEmployeeTakeOnSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.philippinesEmployeeTakeOn);
export const getEmployeeSkillsAndEquitySelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeSkillsAndEquity);
export const getEmployeeDocumentsNotesByIdSelector = (id: number) => createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeDocumentsNotes?.find((document: IDocumentNote) => document.id === id));
export const getEmployeeDocumentsNotesSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeDocumentsNotes);
export const getSelectedEmployeeServicesSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeServices);
export const getSelectedEmployeeServiceSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeService);
export const getSelectedEmployeeRegularHoursSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeRegularHours);
export const getSelectedEmployeeCalcDailyWageSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.calcEmployeeDailyWage);
export const getPeopleEmployeeClassificationSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeClassification);
export const getSelectedEmployeeSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employee);
export const getEmployeesSelector = createSelector(
  selectEmployeeModuleState, state => state?.employee
    ? Object.values(state?.employee?.entities)
      .sort((a: IEmployee, b: IEmployee) => sortByDesc(a, b, 'addedDateTime'))
    : []
);
export const getPeopleEmployeeByIdSelector = (id: number) => createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.entities[id])
export const getPeopleEmployeeIdSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeeId);
export const isEmployeeLoadingSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.isLoading || false);
export const getEmployeeDownloadBulkImportFileSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.downloadedBulkImportFile || undefined);
export const getEmployeeBulkImportViewSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.bulkImportView || undefined);
export const getEmployeeTotalItemsSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employee?.employeestotalCount || 0);


