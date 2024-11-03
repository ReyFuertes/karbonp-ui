import { ActionReducerMap } from '@ngrx/store';

import * as fromRoot from 'src/app/store';
import { TimeOffReducer, TimeOffState } from './time-off.reducer';

export interface TimeOffModuleState {
  timeOff: TimeOffState,
}
export const reducers: ActionReducerMap<TimeOffModuleState> = {
  timeOff: TimeOffReducer,
};
export interface AppState extends fromRoot.AppState {
  timeOffModule: TimeOffModuleState;
}