import { createFeatureSelector, createSelector } from "@ngrx/store";

import { EmployeeModuleState } from "..";

export const selectEmployeeModuleState = createFeatureSelector<EmployeeModuleState>('employeeModule');
export const getEmployeeAppByNameSelector = (name: string) => createSelector(
  selectEmployeeModuleState,
  state => state?.employeeApps?.entities
    ? Object.values(state?.employeeApps?.entities).find(value => value.name === name)
    : undefined)
export const getEmployeeApplicationsSelector = createSelector(
  selectEmployeeModuleState,
  state => state
    ? Object.values(state?.employeeApps?.entities)?.map(value => {
      return Object.assign({}, value, { options: JSON.parse((value?.options as string)) as any })
    })
    : []); 
