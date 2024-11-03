import { on } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { createReducer } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ICommonResponse } from "src/app/models/generic.model";

import {
  calculateEmployeeDailyWageSuccessAction,
  getDocumentsNotesSuccessAction,
  getEmployeeByIdSuccessAction,
  getEmployeesSuccessAction,
  selectPeopleEmployeeByIdAction,
  updatePeopleEmployeeSuccessAction,
  performSearchEmployeesSuccessAction,
  getEmployeesAction,
  clearSelectEmployeeAction,
  getEmployeeByIdAction,
  uploadEmployeeBulkImportAction, uploadEmployeeBulkImportSuccessAction,
  getEmployeeBulkImportViewSuccessAction,
  downloadEmployeeBulkImportFileSuccessAction,
  clearInvitedEmployeesAction,
  quickInvitesAction,
  quickInvitesSuccessAction,
  updatePeopleEmployeeAction,
  getEmployeeDynamicFieldsSuccessAction
} from './employee.action';
import { IDesignation, IDocumentNote, IOrganizationalUnit, IPayPeriod, IPaymentMethod, IPaypoint } from 'src/app/models/generic.model';
import { IEmployee, IEmployeeDynamicFields, IEmployeeService, IEmployeeSkillsEquity, IEmployeeTakeOn, IEmployeeWorkingHour } from '../../employee.model';
import { updateEmployeeAccountStatusSuccessAction } from '../employee-job-details/employee-job-details.action';

export interface EmployeeState extends EntityState<IEmployee> {
  isLoading: boolean,
  employeestotalCount: number;
  employeeDocumentsNotes: IDocumentNote[];
  employeeId: number;
  employee: IEmployee;
  payPeriods: IPayPeriod[];
  paymentMethods: IPaymentMethod[];
  payPoints: IPaypoint[];
  organizationalUnits: IOrganizationalUnit[];
  employeeClassification: IDesignation;
  calcEmployeeDailyWage: number;
  employeeRegularHours: IEmployeeWorkingHour;
  employeeService: IEmployeeService;
  employeeServices: IEmployeeService[];
  employeeDocumentsAndNotes: IDocumentNote[];
  employeeSkillsAndEquity: IEmployeeSkillsEquity;
  philippinesEmployeeTakeOn: IEmployeeTakeOn;
  searchedEmployees: IEmployee[],
  bulkImportView: ICommonResponse,
  downloadedBulkImportFile: any; //note: no proper model
  invitedEmployees: IEmployee[];
  employeesWithoutSelfServiceCount: number;
  employeeDynamicFields: IEmployeeDynamicFields;
}
export const adapter: EntityAdapter<IEmployee> = createEntityAdapter<IEmployee>({
});
export const initialState: EmployeeState = adapter.getInitialState({
  isLoading: false,
  employeestotalCount: 0,
  employeeDocumentsNotes: undefined,
  employeeId: undefined,
  employee: undefined,
  payPeriods: [],
  paymentMethods: [],
  payPoints: [],
  organizationalUnits: [],
  employeeClassification: undefined,
  calcEmployeeDailyWage: 0,
  employeeRegularHours: undefined,
  employeeService: undefined,
  employeeServices: [],
  employeeDocumentsAndNotes: [],
  employeeSkillsAndEquity: undefined,
  philippinesEmployeeTakeOn: undefined,
  searchedEmployees: [],
  bulkImportView: undefined,
  downloadedBulkImportFile: undefined,
  invitedEmployees: [],
  employeesWithoutSelfServiceCount: undefined,
  employeeDynamicFields: undefined
});
const employeeReducer = createReducer(
  initialState,
  on(getEmployeeDynamicFieldsSuccessAction, (state, action) => {
    const data = action?.response?.data;
    if (!data) return state;
    const employeeDynamicFields = {
      id: data?.id,
      bankAccountDetails: JSON.parse(data?.bankAccountDetails),
      basics: JSON.parse(data?.basics),
      biography: JSON.parse(data?.biography),
      countryName: data?.countryName,
      emergencyContacts: JSON.parse(data?.emergencyContacts),
      postalAddress: JSON.parse(data?.postalAddress),
      residentialAddress: JSON.parse(data?.residentialAddress)
    }
    return Object.assign({}, state, { employeeDynamicFields });
  }),
  on(getEmployeeDynamicFieldsSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeesWithoutSelfServiceCount: action?.response });
  }),
  on(getEmployeeBulkImportViewSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeesWithoutSelfServiceCount: action?.response });
  }),
  on(getEmployeeBulkImportViewSuccessAction, (state, action) => {
    return Object.assign({}, state, { bulkImportView: action.response.data });
  }),
  on(downloadEmployeeBulkImportFileSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedBulkImportFile: action.response });
  }),
  on(uploadEmployeeBulkImportAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(uploadEmployeeBulkImportSuccessAction, (state) => {
    return Object.assign({}, state, { isLoading: false });
  }),
  on(clearInvitedEmployeesAction, (state) => {
    return Object.assign({ ...state, invitedEmployees: [] });
  }),
  on(quickInvitesAction, (state) => {
    return Object.assign({ ...state, isLoading: true });
  }),
  on(quickInvitesSuccessAction, (state, action) => {
    return Object.assign({ ...state, invitedEmployees: action.response, isLoading: false });
  }),
  on(updateEmployeeAccountStatusSuccessAction, (state, action) => {
    return adapter.updateOne({ id: action.response.id, changes: action.response }, state);
  }),
  on(updateEmployeeAccountStatusSuccessAction, (state, action) => {
    return Object.assign({ ...state, employee: action.response });
  }),
  on(performSearchEmployeesSuccessAction, (state, action) => {
    return Object.assign({ ...state, searchedEmployees: action.response });
  }),
  on(getDocumentsNotesSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeeDocumentsNotes: action.response?.data });
  }),
  on(calculateEmployeeDailyWageSuccessAction, (state, action) => {
    return Object.assign({ ...state, calcEmployeeDailyWage: action.dailyWageResponse.data }); //common response data?
  }),
  on(updatePeopleEmployeeAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(updatePeopleEmployeeSuccessAction, (state, action) => {
    return ({ ...adapter.updateOne({ id: action.response.id, changes: action.response }, state), isLoading: false });
  }),
  on(selectPeopleEmployeeByIdAction, (state, action) => {
    return Object.assign({ ...state, employeeId: action.id });
  }),
  on(clearSelectEmployeeAction, (state) => {
    return Object.assign({ ...state, employee: undefined });
  }),
  on(getEmployeeByIdAction, (state) => {
    return Object.assign({ ...state, isLoading: true });
  }),
  on(getEmployeeByIdSuccessAction, (state, action) => {
    const employee = action.response?.employee;
    const payPeriods = action.response?.payPeriods || [];
    const paymentMethods = action.response?.paymentMethods || [];
    const payPoints = action.response?.payPoints || [];
    const organizationalUnits = action.response?.organizationalUnits || [];
    const employeeClassification = action.response?.employeeClassification;
    const employeeRegularHours = action.response?.employeeRegularHours;
    const employeeService = action.response?.employeeService;
    const employeeServices = action.response?.employeeServices;
    const employeeSkillsAndEquity = action.response?.employeeSkillsAndEquity;
    const philippinesEmployeeTakeOn = action.response?.philippinesEmployeeTakeOn
    return Object.assign({
      ...state,
      employee,
      payPeriods,
      paymentMethods,
      payPoints,
      organizationalUnits,
      employeeClassification,
      employeeRegularHours,
      employeeService,
      employeeServices,
      employeeSkillsAndEquity,
      philippinesEmployeeTakeOn,
      isLoading: false
    });
  }),
  on(getEmployeesAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getEmployeesSuccessAction, (state, action) => {
    return Object.assign({
      ...adapter.setAll(action.response?.items || [], state),
      isFilterLoading: false,
      employeestotalCount: action.response?.totalItems,
      isLoading: false
    })
  })
);
export function EmployeeReducer(state: EmployeeState, action: Action) {
  return employeeReducer(state, action);
}
