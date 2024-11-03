import { IApplication } from "../../employee.model";
import { Action, createReducer, on } from "@ngrx/store";

import { getEmployeeAppsSuccessAction, updateEmployeeAppSuccessAction } from "./employee-apps.action";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

export interface EmployeeAppsState extends EntityState<IApplication> {
}
export const adapter: EntityAdapter<IApplication> = createEntityAdapter<IApplication>({});
export const initialState: EmployeeAppsState = adapter.getInitialState({
});

const employeeAppsReducer = createReducer(
  initialState,
  on(updateEmployeeAppSuccessAction, (state, action) => {
    return ({ ...adapter.updateOne({ id: action.response.id, changes: action.response }, state) })
  }),
  on(getEmployeeAppsSuccessAction, (state, action) => {
    return Object.assign({ ...adapter.setAll(action.response || [], state) })
  }),
);
export function EmployeeAppsReducer(state: EmployeeAppsState, action: Action) {
  return employeeAppsReducer(state, action);
}