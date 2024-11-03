import { createAction, props } from "@ngrx/store";
import { IEmployee } from "src/app/modules/employee/employee.model";


export enum PeopleTypes {
  getPeopleByStatusesIdsAction = '[People Status] get people by status ids',
  getPeopleByStatusesIdsSuccessAction = '[People Status] get people by status ids (success)',
}
export const getPeopleByStatusesIdsAction = createAction(
  PeopleTypes.getPeopleByStatusesIdsAction,
  props<{ ids: number[] }>()
);
export const getPeopleByStatusesIdsSuccessAction = createAction(
  PeopleTypes.getPeopleByStatusesIdsSuccessAction,
  props<{ response: IEmployee[] }>()
);