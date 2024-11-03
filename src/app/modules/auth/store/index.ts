import { ActionReducerMap } from '@ngrx/store';
import * as fromRoot from 'src/app/store';
import { AuthReducer, AuthState } from './auth.reducer';

export interface AuthModuleState {
  auth: AuthState,
}
export const reducers: ActionReducerMap<AuthModuleState> = {
  auth: AuthReducer,
};
export interface AppState extends fromRoot.AppState {
  authModule: AuthModuleState;
}