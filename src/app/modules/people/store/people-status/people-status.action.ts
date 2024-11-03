import { createAction, props } from "@ngrx/store";
import { IPeopleStatus } from "../../people.model";
import { IEmployee } from "../../../employee/employee.model";

export enum PeopleStatusTypes {
  setHasErrorAction = '[People Status] set has error',
  getPeopleStatusesAction = '[People Status] get people status',
  getPeopleStatusesSuccessAction = '[People Status] get people status (success)',
  getPeopleStatusByIdAction = '[People Status] get people status by id',
  getPeopleStatusByIdSuccessAction = '[People Status] get people status by id (success)',
  addPeopleStatusAction = '[People Status] add people status',
  addPeopleStatusSuccessAction = '[People Status] add people status (success)',
  updatePeopleStatusAction = '[People Status] update people status',
  updatePeopleStatusSuccessAction = '[People Status] update people status (success)',
  deletePeopleStatusAction = '[People Status] delete people status',
  deletePeopleStatusSuccessAction = '[People Status] delete people status (success)',
  getPeopleByStatusesIdsAction = '[People Status] get people by status ids',
  getPeopleByStatusesIdsSuccessAction = '[People Status] get people by status ids (success)',
}
export const getPeopleByStatusesIdsAction = createAction(
  PeopleStatusTypes.getPeopleByStatusesIdsAction,
  props<{ ids: number[] }>()
);
export const getPeopleByStatusesIdsSuccessAction = createAction(
  PeopleStatusTypes.getPeopleByStatusesIdsSuccessAction,
  props<{ response: IEmployee[] }>()
);
export const deletePeopleStatusAction = createAction(
  PeopleStatusTypes.deletePeopleStatusAction,
  props<{ id: number }>()
);
export const deletePeopleStatusSuccessAction = createAction(
  PeopleStatusTypes.deletePeopleStatusSuccessAction,
  props<{ response: IPeopleStatus }>()
);
export const updatePeopleStatusAction = createAction(
  PeopleStatusTypes.updatePeopleStatusAction,
  props<{ payload: IPeopleStatus }>()
);
export const updatePeopleStatusSuccessAction = createAction(
  PeopleStatusTypes.updatePeopleStatusSuccessAction,
  props<{ response: IPeopleStatus }>()
);
export const addPeopleStatusAction = createAction(
  PeopleStatusTypes.addPeopleStatusAction,
  props<{ payload: IPeopleStatus }>()
);
export const addPeopleStatusSuccessAction = createAction(
  PeopleStatusTypes.addPeopleStatusSuccessAction,
  props<{ response: IPeopleStatus }>()
);
export const getPeopleStatusByIdAction = createAction(
  PeopleStatusTypes.getPeopleStatusByIdAction,
  props<{ id: number }>()
);
export const getPeopleStatusesAction = createAction(
  PeopleStatusTypes.getPeopleStatusesAction
);
export const getPeopleStatusesSuccessAction = createAction(
  PeopleStatusTypes.getPeopleStatusesSuccessAction,
  props<{ response: IPeopleStatus[] }>()
);
export const setHasErrorAction = createAction(
  PeopleStatusTypes.setHasErrorAction,
  props<{ hasError: boolean }>()
);