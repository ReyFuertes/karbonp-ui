import { createReducer, on, Action } from "@ngrx/store";
import { logoutSuccessAction } from "./auth.action";

export interface AuthState {
}
export const initialState: AuthState = {
};
const authReducer = createReducer(
  initialState,
  on(logoutSuccessAction, (state) => {
    return Object.assign({}, state, {});
  })
);

export function AuthReducer(state: AuthState, action: Action) {
  return authReducer(state, action);
}