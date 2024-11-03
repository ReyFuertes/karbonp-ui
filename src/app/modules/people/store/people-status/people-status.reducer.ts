import { createReducer, on, Action } from "@ngrx/store";

import { addPeopleStatusSuccessAction, deletePeopleStatusSuccessAction, getPeopleByStatusesIdsSuccessAction, getPeopleStatusesAction, getPeopleStatusesSuccessAction, updatePeopleStatusSuccessAction } from "./people-status.action";
import { IPeopleStatus } from "../../people.model";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { IEmployee } from "../../../employee/employee.model";

export interface PeopleStatusState extends EntityState<IPeopleStatus> {
  isLoading: boolean,
  hasError: boolean,
  statuses: IPeopleStatus[],
  filteredPeople: IEmployee[]
}
export const adapter: EntityAdapter<IPeopleStatus> = createEntityAdapter<IPeopleStatus>({});
export const initialState: PeopleStatusState = adapter.getInitialState({
  isLoading: undefined,
  hasError: undefined,
  statuses: undefined,
  filteredPeople: []
});
const peopleStatusReducer = createReducer(
  initialState,
  on(getPeopleByStatusesIdsSuccessAction, (state, action) => {
    return Object.assign({}, state, { filteredPeople: action.response });
  }),
  on(deletePeopleStatusSuccessAction, (state, action) => {
    return ({ ...adapter.removeOne(action.response.id, state) })
  }),
  on(updatePeopleStatusSuccessAction, (state, action) => {
    return adapter.updateOne({ id: action.response.id, changes: action.response }, state)
  }),
  on(addPeopleStatusSuccessAction, (state, action) => {
    return ({ ...adapter.addOne(action.response, state) })
  }),
  on(getPeopleStatusesAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getPeopleStatusesSuccessAction, (state, action) => {
    return ({ ...adapter.setAll(action.response, state), isLoading: false })
  })
);

export function PeopleStatusReducer(state: PeopleStatusState, action: Action) {
  return peopleStatusReducer(state, action);
}