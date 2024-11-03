import { createAction, props } from "@ngrx/store";

import { ICommonResponse, IEmployeeTimeOffBookings, ILatestTimeBalance, ITimeOffBookingItem, ITimeOffRequestPayload } from "src/app/models/generic.model";
import { IPublicHoliday } from "src/app/modules/time-off/time-off.model";
import { IEmployeeTimeOffActivity, IEmployeeTimeOffPolicy, IEmployeeTimeOffTakeOn, ITimeOffActivityPayload, ITimeOffAdjustment } from "../../employee.model";

export enum EmployeeTimeOffTypes {
  setEmployeeTimeOffLoadingAction = '[Employee TimeOff] set loading',
  getEmployeeTimeOffBookingsAction = '[Employee TimeOff] get time off bookings',
  getEmployeeTimeOffBookingsSuccessAction = '[Employee TimeOff] get time off bookings (success)',
  deleteTimeOffBookingAction = '[Employee TimeOff] delete time-off booking',
  deleteTimeOffBookingSuccessAction = '[Employee TimeOff] delete time-off booking (success)',
  deleteTimeOffAdjustmentAction = '[Employee TimeOff] delete time-off adjustment',
  deleteTimeOffAdjustmentSuccessAction = '[Employee TimeOff] delete time-off adjustment (success)',
  getEmployeeTimeOffAdjustmentsAction = '[Employee TimeOff] get time off adjustments',
  getEmployeeTimeOffAdjustmentsSuccessAction = '[Employee TimeOff] get time off adjustments (success)',
  saveEmployeeTimeOffAdjustmentsAction = '[Employee TimeOff] save time off adjustments',
  saveEmployeeTimeOffAdjustmentsSuccessAction = '[Employee TimeOff] save time off adjustments (success)',
  getEmployeeTimeOffPolicyAction = '[Employee TimeOff] get time off policy',
  getEmployeeTimeOffPolicySuccessAction = '[Employee TimeOff] get time off policy (success)',
  saveEmployeeTimeOffPolicyAction = '[Employee TimeOff] save time off policy',
  saveEmployeeTimeOffPolicySuccessAction = '[Employee TimeOff] save time off policy (success)',
  getEmployeeTimeOffTakeOnsAction = '[Employee TimeOff] get time off take-ons',
  getEmployeeTimeOffTakeOnsSuccessAction = '[Employee TimeOff] get time off take-ons (success)',
  saveEmployeeTimeOffTakeOnAction = '[Employee TimeOff] save time off take-ons',
  saveEmployeeTimeOffTakeOnSuccessAction = '[Employee TimeOff] save time off take-ons (success)',
  getEmployeeTimeOffActivitiesAction = '[Employee TimeOff] get time off activities',
  getEmployeeTimeOffActivitiesSuccessAction = '[Employee TimeOff] get time off activities (success)',
  getEmployeesTimeOffRequestBookingsOverviewAction = '[Employee TimeOff] get time off requests bookings overview',
  getEmployeesTimeOffRequestBookingsOverviewSuccessAction = '[Employee TimeOff] get time off requests bookings overview (success)',
  getEmployeeLatestTimeBalanceAction = '[Employee] get latest time balance',
  getEmployeeLatestTimeBalanceSuccessAction = '[Employee] get latest time balance (success)',
  updateEmployeeSaveTimeOffBookingAction = '[Employee] update employee time-off booking',
  updateEmployeeSaveTimeOffBookingSuccessAction = '[Employee] update employee time-off booking (success)'
}
export const updateEmployeeSaveTimeOffBookingAction = createAction(
  EmployeeTimeOffTypes.updateEmployeeSaveTimeOffBookingAction,
  props<{
    payload: {
      employeeId: string,
      fromDate: string,
      leaveSetupId: string,
      note: string,
      timeOffBookingItems: ITimeOffBookingItem[]
      toDate: string
    }
  }>()
);
export const updateEmployeeSaveTimeOffBookingSuccessAction = createAction(
  EmployeeTimeOffTypes.updateEmployeeSaveTimeOffBookingSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getEmployeeLatestTimeBalanceAction = createAction(
  EmployeeTimeOffTypes.getEmployeeLatestTimeBalanceAction,
  props<{ payload: ITimeOffActivityPayload }>()
);
export const getEmployeeLatestTimeBalanceSuccessAction = createAction(
  EmployeeTimeOffTypes.getEmployeeLatestTimeBalanceSuccessAction,
  props<{ response: ILatestTimeBalance[] }>()
);
export const getEmployeesTimeOffRequestBookingsOverviewAction = createAction(
  EmployeeTimeOffTypes.getEmployeesTimeOffRequestBookingsOverviewAction,
  props<{ payload: ITimeOffRequestPayload }>()
);
export const getEmployeesTimeOffRequestBookingsOverviewSuccessAction = createAction(
  EmployeeTimeOffTypes.getEmployeesTimeOffRequestBookingsOverviewSuccessAction,
  props<{ response: IPublicHoliday[] }>()
);
export const getEmployeeTimeOffActivitiesAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffActivitiesAction,
  props<{ id: number }>()
);
export const getEmployeeTimeOffActivitiesSuccessAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffActivitiesSuccessAction,
  props<{ response: IEmployeeTimeOffActivity[] }>()
);
export const saveEmployeeTimeOffTakeOnAction = createAction(
  EmployeeTimeOffTypes.saveEmployeeTimeOffTakeOnAction,
  props<{ payload: { timeOffTakeOns: IEmployeeTimeOffTakeOn[] } }>()
);
export const saveEmployeeTimeOffTakeOnSuccessAction = createAction(
  EmployeeTimeOffTypes.saveEmployeeTimeOffTakeOnSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getEmployeeTimeOffTakeOnsAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffTakeOnsAction,
  props<{ id: number }>()
);
export const getEmployeeTimeOffTakeOnsSuccessAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffTakeOnsSuccessAction,
  props<{ response: { timeOffTakeOnItems: IEmployeeTimeOffTakeOn[] } }>()
);
export const saveEmployeeTimeOffPolicyAction = createAction(
  EmployeeTimeOffTypes.saveEmployeeTimeOffPolicyAction,
  props<{ payload: IEmployeeTimeOffPolicy[] }>()
);
export const saveEmployeeTimeOffPolicySuccessAction = createAction(
  EmployeeTimeOffTypes.saveEmployeeTimeOffPolicySuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getEmployeeTimeOffPolicyAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffPolicyAction,
  props<{ id: number }>()
);
export const getEmployeeTimeOffPolicySuccessAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffPolicySuccessAction,
  props<{ response: IEmployeeTimeOffPolicy[] }>()
);
export const deleteTimeOffAdjustmentAction = createAction(
  EmployeeTimeOffTypes.deleteTimeOffAdjustmentAction,
  props<{ id: number }>()
);
export const deleteTimeOffAdjustmentSuccessAction = createAction(
  EmployeeTimeOffTypes.deleteTimeOffAdjustmentSuccessAction,
  props<{ response: any }>()
);
export const saveEmployeeTimeOffAdjustmentsAction = createAction(
  EmployeeTimeOffTypes.saveEmployeeTimeOffAdjustmentsAction,
  props<{ payload: ITimeOffAdjustment }>()
);
export const saveEmployeeTimeOffAdjustmentsSuccessAction = createAction(
  EmployeeTimeOffTypes.saveEmployeeTimeOffAdjustmentsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getEmployeeTimeOffAdjustmentsAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffAdjustmentsAction,
  props<{ id: number }>()
);
export const getEmployeeTimeOffAdjustmentsSuccessAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffAdjustmentsSuccessAction,
  props<{ response: ITimeOffAdjustment[] }>()
);
export const deleteTimeOffBookingAction = createAction(
  EmployeeTimeOffTypes.deleteTimeOffBookingAction,
  props<{ id: number }>()
);
export const deleteTimeOffBookingSuccessAction = createAction(
  EmployeeTimeOffTypes.deleteTimeOffBookingSuccessAction,
  props<{ response: any }>()
);
export const getEmployeeTimeOffBookingsAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffBookingsAction,
  props<{ payload: { employeeId: number, fromDate: string, toDate: string } }>()
);
export const getEmployeeTimeOffBookingsSuccessAction = createAction(
  EmployeeTimeOffTypes.getEmployeeTimeOffBookingsSuccessAction,
  props<{ response: IEmployeeTimeOffBookings }>()
);
export const setEmployeeTimeOffLoadingAction = createAction(
  EmployeeTimeOffTypes.setEmployeeTimeOffLoadingAction,
  props<{ loading: boolean }>()
);