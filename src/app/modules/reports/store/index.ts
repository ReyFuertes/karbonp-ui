import { ActionReducerMap } from '@ngrx/store';

import * as fromRoot from 'src/app/store';
import { ReportsReducer, ReportsState } from './reports.reducer';

export interface ReportsModuleState {
  reports: ReportsState
}
export const reportsReducers: ActionReducerMap<ReportsModuleState> = {
  reports: ReportsReducer
};

export interface AppState extends fromRoot.AppState {
  reportsModule: ReportsModuleState;
}