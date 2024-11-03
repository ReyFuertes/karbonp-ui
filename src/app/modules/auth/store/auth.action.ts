import { createAction, props } from '@ngrx/store';

import { ILoginInfo, ILoginInfoResponse } from '../auth.model';

export enum AuthTypes {
  loginAction = '[Auth] login',
  loginSuccessAction = '[Auth] login (success)',
  logoutAction = '[Auth] logout',
  logoutSuccessAction = '[Auth] logout (success)',
}
export const loginAction = createAction(
  AuthTypes.loginAction,
  props<{ payload: ILoginInfo }>()
);
export const loginSuccessAction = createAction(
  AuthTypes.loginSuccessAction,
  props<{ response: ILoginInfoResponse }>()
);
export const logoutAction = createAction(
  AuthTypes.logoutAction
);
export const logoutSuccessAction = createAction(
  AuthTypes.logoutSuccessAction
);