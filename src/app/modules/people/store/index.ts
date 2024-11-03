import { ActionReducerMap } from '@ngrx/store';

import * as fromRoot from 'src/app/store';
import { PeopleStatusReducer, PeopleStatusState } from './people-status/people-status.reducer';
import { PeopleReducer, PeopleState } from './people/people.reducer';
import { EmployeeReducer, EmployeeState } from '../../employee/store/employee/employee.reducer';

export const peopleReducers: ActionReducerMap<PeopleStateModule> = {
  employeeState: EmployeeReducer,
  peopleState: PeopleReducer,
  peopleStatusState: PeopleStatusReducer
};
export interface PeopleStateModule {
  employeeState: EmployeeState,
  peopleState: PeopleState,
  peopleStatusState: PeopleStatusState
}
export interface PeopleAppState extends fromRoot.AppState {
  peopleModule: PeopleStateModule;
}