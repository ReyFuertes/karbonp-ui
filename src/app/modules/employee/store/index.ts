import { ActionReducerMap } from '@ngrx/store';

import * as fromRoot from 'src/app/store';
import { EmployeeTimeOffReducer, EmployeeTimeOffState } from './time-off/time-off.reducer';
import { EmployeeReducer, EmployeeState } from './employee/employee.reducer';
import { EmployeeAppsReducer, EmployeeAppsState } from './employee-apps/employee-apps.reducer';

export interface EmployeeModuleState {
  employee: EmployeeState,
  employeeTimeOff: EmployeeTimeOffState,
  employeeApps: EmployeeAppsState,
}
export const employeeReducers: ActionReducerMap<EmployeeModuleState> = {
  employee: EmployeeReducer,
  employeeTimeOff: EmployeeTimeOffReducer,
  employeeApps: EmployeeAppsReducer,
};
export interface AppState extends fromRoot.AppState {
  employeeModule: EmployeeModuleState;
}