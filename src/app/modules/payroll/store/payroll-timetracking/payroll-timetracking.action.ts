import { createAction, props } from "@ngrx/store";

import { IPayrunTimeAttendance, ITimeTrackingIntegration } from "../../payroll.model";

export enum PayrollPayrunTimeTrackingTypes {
  getPayrunTimeTrackingIntegrationAction = '[Payroll payrun timetracking] get time tracking integration',
  getPayrunTimeTrackingIntegrationSuccessAction = '[Payroll payrun timetracking] get time tracking integration (success)',
  getPayrunTimeAttendanceAction = '[Payroll payrun timetracking] get time attendance',
  getPayrunTimeAttendanceSuccessAction = '[Payroll payrun timetracking] get time attendance (success)',
}
export const getPayrunTimeAttendanceAction = createAction(
  PayrollPayrunTimeTrackingTypes.getPayrunTimeAttendanceAction
);
export const getPayrunTimeAttendanceSuccessAction = createAction(
  PayrollPayrunTimeTrackingTypes.getPayrunTimeAttendanceSuccessAction,
  props<{ response: IPayrunTimeAttendance }>()
);
export const getPayrunTimeTrackingIntegrationAction = createAction(
  PayrollPayrunTimeTrackingTypes.getPayrunTimeTrackingIntegrationAction
);
export const getPayrunTimeTrackingIntegrationSuccessAction = createAction(
  PayrollPayrunTimeTrackingTypes.getPayrunTimeTrackingIntegrationSuccessAction,
  props<{ response: ITimeTrackingIntegration }>()
);