import { createAction, props } from "@ngrx/store";
import { IEmployee } from "../../employee.model";

export enum EmployeeAccountStatusTypes {
  updateEmployeeAccountStatusAction = '[People Job Details] update employee account status',
  updateEmployeeAccountStatusSuccessAction = '[People Job Details] update employee account status (success)',
}
export const updateEmployeeAccountStatusAction = createAction(
  EmployeeAccountStatusTypes.updateEmployeeAccountStatusAction,
  props<{ payload: IEmployee }>()
);
export const updateEmployeeAccountStatusSuccessAction = createAction(
  EmployeeAccountStatusTypes.updateEmployeeAccountStatusSuccessAction,
  props<{ response: IEmployee }>()
);
