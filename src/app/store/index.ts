import { ActionReducerMap } from "@ngrx/store";

import { InitAppReducer, InitAppState } from "./app.reducer";

export interface AppState {
  app: InitAppState,
}
export const reducers: ActionReducerMap<AppState> = {
  app: InitAppReducer,
};