import { createReducer, on, Action } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { IEmployee } from "../../../employee/employee.model";
import { getPeopleByStatusesIdsSuccessAction } from "./people.action";

export interface PeopleState extends EntityState<IEmployee> {
}
export const adapter: EntityAdapter<IEmployee> = createEntityAdapter<IEmployee>({});
export const initialState: PeopleState = adapter.getInitialState({
});
const peopleReducer = createReducer(
  initialState,
  on(getPeopleByStatusesIdsSuccessAction, (state, action) => {
    return ({ ...adapter.setAll(action.response, state) })
  })
);
export function PeopleReducer(state: PeopleState, action: Action) {
  return peopleReducer(state, action);
}