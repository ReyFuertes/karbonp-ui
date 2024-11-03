import { createAction, props } from "@ngrx/store";

import { ICommonResponse, ICountry, ILeaveSetup, ILocationNavMenu, IMultiSelectEmployee, IOrganizationalUnit, IPaginationPayload, IPassportCountryCodes, IPayPeriod, IPaymentMethod, IPaypoint, ISimplePayload, IUser } from "../models/generic.model";
import { IEmployeeShift, IEmployeeShiftPayload } from "../modules/employee/employee.model";
import { ITodoListWidgetData } from "../models/dashboard.model";

export enum AppInitActionTypes {
  initAppAction = '[App] initialize',
  initAppSuccessAction = '[App] initialize (success)',
  initSetTokenAction = '[App] set token from local storage',
  loginFailedAction = '[App] login (failed)',
  getCountriesAction = '[App] get countries',
  getCountriesSuccessAction = '[App] get countries (success)',
  getOrganizationalUnitsAction = '[App] get organizational unit',
  getOrganizationalUnitsSuccessAction = '[App] get organizational unit (success)',
  getPaymentMethodAction = '[App] get payment method',
  getPaymentMethodSuccessAction = '[App] get payment method (success)',
  getPayPointsAction = '[App] get paypoints',
  getPayPointsSuccessAction = '[App] get paypoints (success)',
  getPayPeriodsAction = '[App] get pay periods',
  getPayPeriodsSuccessAction = '[App] get pay periods (success)',
  getMenuLocationsAction = '[App] get menu locations',
  getMenuLocationsSuccessAction = '[App] get menu locations (success)',
  getAvailableExchangeRatesAction = '[App] get available exchange rates',
  getAvailableExchangeRatesSuccessAction = '[App] get available exchange rates (success)',
  getEmployeeShiftsAction = '[App] get employee shifts',
  getEmployeeShiftsSuccessAction = '[App] get employee shifts (success)',
  getPassportCountryCodesAction = '[App] get passport country codes',
  getPassportCountryCodesSuccessAction = '[App] get passport country codes (success)',
  getLeaveSetupLocationAction = '[App] get leave setup location',
  getLeaveSetupLocationSuccessAction = '[App] get leave setup location (success)',
  getLeaveTimeOffSetupsPoliciesAction = '[App] get leave time off policies',
  getLeaveTimeOffSetupsPoliciesSuccessAction = '[App] get leave time off policies (success)',
  getPayPointsForCurrentUserAction = '[App] get paypoints for current user',
  getPayPointsForCurrentUserSuccessAction = '[App] get paypoints for current user (success)',
  updateTokenWithLocationAction = '[App] update token location',
  updateTokenWithLocationSuccessAction = '[App] update token location (success)',
  getTodoListWidgetDataAction = '[App] get todo list',
  getTodoListWidgetDataSuccessAction = '[App] get get todo list (success)',
  getMultiSelectEmployeesAction = '[App] get multi select employees',
  getMultiSelectEmployeesSuccessAction = '[App] get multi select employees (success)',
  getLeaveSetupsAction = '[App] get leave setups',
  getLeaveSetupsSuccessAction = '[App] get leave setups (success)',
  getLoggedInUserAction = '[App] get logged-in user',
  getLoggedInUserSuccessAction = '[App] get logged-in user (success)',
}
export const getLoggedInUserAction = createAction(
  AppInitActionTypes.getLoggedInUserAction
);
export const getLoggedInUserSuccessAction = createAction(
  AppInitActionTypes.getLoggedInUserSuccessAction,
  props<{ response: IUser }>() //note: remove the darn password -_-
);
export const getLeaveSetupsAction = createAction(
  AppInitActionTypes.getLeaveSetupsAction,
  props<{ payload: { implementSortingAndPaging: boolean } }>()
);
export const getLeaveSetupsSuccessAction = createAction(
  AppInitActionTypes.getLeaveSetupsSuccessAction,
  props<{ response: { items: ILeaveSetup[], totalItems: number } }>()
);
export const getMultiSelectEmployeesAction = createAction(
  AppInitActionTypes.getMultiSelectEmployeesAction
);
export const getMultiSelectEmployeesSuccessAction = createAction(
  AppInitActionTypes.getMultiSelectEmployeesSuccessAction,
  props<{ response: IMultiSelectEmployee[] }>()
);
export const getTodoListWidgetDataAction = createAction(
  AppInitActionTypes.getTodoListWidgetDataAction
);
export const getTodoListWidgetDataSuccessAction = createAction(
  AppInitActionTypes.getTodoListWidgetDataSuccessAction,
  props<{ response: ITodoListWidgetData }>()
);
export const updateTokenWithLocationAction = createAction(
  AppInitActionTypes.updateTokenWithLocationAction,
  props<{ locationId: string }>()
);
export const updateTokenWithLocationSuccessAction = createAction(
  AppInitActionTypes.updateTokenWithLocationSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayPointsForCurrentUserAction = createAction(
  AppInitActionTypes.getPayPointsForCurrentUserAction
);
export const getPayPointsForCurrentUserSuccessAction = createAction(
  AppInitActionTypes.getPayPointsForCurrentUserSuccessAction,
  props<{ response: IPaypoint[] }>()
);
export const getLeaveTimeOffSetupsPoliciesAction = createAction(
  AppInitActionTypes.getLeaveTimeOffSetupsPoliciesAction
);
export const getLeaveTimeOffSetupsPoliciesSuccessAction = createAction(
  AppInitActionTypes.getLeaveTimeOffSetupsPoliciesSuccessAction,
  props<{ response: ILeaveSetup[] }>()
);
export const getLeaveSetupLocationAction = createAction(
  AppInitActionTypes.getLeaveSetupLocationAction
);
export const getLeaveSetupLocationSuccessAction = createAction(
  AppInitActionTypes.getLeaveSetupLocationSuccessAction,
  props<{ response: ILeaveSetup[] }>()
);
export const getPassportCountryCodesAction = createAction(
  AppInitActionTypes.getPassportCountryCodesAction,
  props<{ payload: ISimplePayload }>()
);
export const getPassportCountryCodesSuccessAction = createAction(
  AppInitActionTypes.getPassportCountryCodesSuccessAction,
  props<{ passportCountryCodes: IPassportCountryCodes[] }>()
);
export const getEmployeeShiftsAction = createAction(
  AppInitActionTypes.getEmployeeShiftsAction,
  props<{ payload: IEmployeeShiftPayload }>()
);
export const getEmployeeShiftsSuccessAction = createAction(
  AppInitActionTypes.getEmployeeShiftsSuccessAction,
  props<{ employeeShifts: IEmployeeShift[] }>()
);
export const getAvailableExchangeRatesAction = createAction(
  AppInitActionTypes.getAvailableExchangeRatesAction
);
export const getAvailableExchangeRatesSuccessAction = createAction(
  AppInitActionTypes.getAvailableExchangeRatesSuccessAction,
  props<{ availableExchangeRatesResponse: ICommonResponse }>()
);
export const getMenuLocationsAction = createAction(
  AppInitActionTypes.getMenuLocationsAction
);
export const getMenuLocationsSuccessAction = createAction(
  AppInitActionTypes.getMenuLocationsSuccessAction,
  props<{ locationNavMenu: ILocationNavMenu }>()
);
export const getPayPeriodsAction = createAction(
  AppInitActionTypes.getPayPeriodsAction,
  props<{ payload: IPaginationPayload }>()
);
//note: we need to refactor this, since this exist in payroll-settings-pay-period
export const getPayPeriodsSuccessAction = createAction(
  AppInitActionTypes.getPayPeriodsSuccessAction,
  props<{ response: IPayPeriod[] }>()
);
export const getPayPointsAction = createAction(
  AppInitActionTypes.getPayPointsAction,
  props<{ payload: IPaginationPayload }>()
);
export const getPayPointsSuccessAction = createAction(
  AppInitActionTypes.getPayPointsSuccessAction,
  props<{ payPoints: IPaypoint[] }>()
);
export const getPaymentMethodAction = createAction(
  AppInitActionTypes.getPaymentMethodAction,
  props<{ payload: IPaginationPayload }>()
);
export const getPaymentMethodSuccessAction = createAction(
  AppInitActionTypes.getPaymentMethodSuccessAction,
  props<{ paymentMethods: IPaymentMethod[] }>()
);
export const getOrganizationalUnitsAction = createAction(
  AppInitActionTypes.getOrganizationalUnitsAction,
);
export const getOrganizationalUnitsSuccessAction = createAction(
  AppInitActionTypes.getOrganizationalUnitsSuccessAction,
  props<{ organizationalUnits: IOrganizationalUnit[] }>()
);
export const getCountriesAction = createAction(
  AppInitActionTypes.getCountriesAction,
);
export const getCountriesSuccessAction = createAction(
  AppInitActionTypes.getCountriesSuccessAction,
  props<{ countries: ICountry[] }>()
);
export const initSetTokenAction = createAction(
  AppInitActionTypes.initSetTokenAction,
  props<{ token: string }>()
);
export const initAppAction = createAction(
  AppInitActionTypes.initAppAction,
);
export const initAppSuccessAction = createAction(
  AppInitActionTypes.initAppSuccessAction,
  props<{ token: string }>()
);
export const loginFailedAction = createAction(
  AppInitActionTypes.loginFailedAction,
  props<{ error: string }>()
);