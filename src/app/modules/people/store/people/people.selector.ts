import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PeopleStateModule } from "..";
import { sortByDesc } from "src/app/shared/util/sort";
import { IEmployee } from "src/app/modules/employee/employee.model";

export const selectPeopleEmployeeModuleState = createFeatureSelector<PeopleStateModule>('peopleModule');
export const getPeopleEmployeesSelector = createSelector(
  selectPeopleEmployeeModuleState, state => {
    return Object.values(state?.employeeState?.entities || [])
      .sort((a: IEmployee, b: IEmployee) => sortByDesc(a, b, 'addedDateTime'))
  }
);
export const getFilteredPeopleSelector = createSelector(
  selectPeopleEmployeeModuleState, state => {
    return Object.values(state?.peopleState?.entities || [])
      .sort((a: IEmployee, b: IEmployee) => sortByDesc(a, b, 'addedDateTime'))
  }
);