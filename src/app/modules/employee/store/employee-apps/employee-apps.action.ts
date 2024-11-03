import { createAction, props } from "@ngrx/store";

import { IApplication } from "../../employee.model";

export enum EmployeeAppsTypes {
  getEmployeeAppsAction = '[Employee Apps] get apps',
  getEmployeeAppsSuccessAction = '[Employee Apps] get apps (success)',
  getEmployeeAppByIdAction = '[Employee Apps] get app by id',
  getEmployeeAppByIdSuccessAction = '[Employee Apps] get app by id (success)',
  updateEmployeeAppAction = '[Employee Apps] update app',
  updateEmployeeAppSuccessAction = '[Employee Apps] update app (success)',
}
export const updateEmployeeAppAction = createAction(
  EmployeeAppsTypes.updateEmployeeAppAction,
  props<{ payload: IApplication }>()
);
export const updateEmployeeAppSuccessAction = createAction(
  EmployeeAppsTypes.updateEmployeeAppSuccessAction,
  props<{ response: IApplication }>()
);
export const getEmployeeAppByIdAction = createAction(
  EmployeeAppsTypes.getEmployeeAppByIdAction,
  props<{ id: string }>()
);
export const getEmployeeAppByIdSuccessAction = createAction(
  EmployeeAppsTypes.getEmployeeAppByIdSuccessAction,
  props<{ response: IApplication }>()
);
export const getEmployeeAppsAction = createAction(
  EmployeeAppsTypes.getEmployeeAppsAction,
  props<{ payload: IApplication }>()
);
export const getEmployeeAppsSuccessAction = createAction(
  EmployeeAppsTypes.getEmployeeAppsSuccessAction,
  props<{ response: IApplication[] }>()
);