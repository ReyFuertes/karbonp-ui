import { on } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { createReducer } from '@ngrx/store';

import { getAvailableExchangeRatesSuccessAction, getCountriesSuccessAction, getEmployeeShiftsSuccessAction, getLeaveSetupLocationSuccessAction, getMenuLocationsSuccessAction, getOrganizationalUnitsSuccessAction, getPassportCountryCodesSuccessAction, getPayPointsSuccessAction, getPaymentMethodSuccessAction, getLeaveTimeOffSetupsPoliciesSuccessAction, initAppSuccessAction, initSetTokenAction, loginFailedAction, getPayPointsForCurrentUserSuccessAction, getTodoListWidgetDataSuccessAction, getMultiSelectEmployeesSuccessAction, getLeaveSetupsSuccessAction, getPayPeriodsSuccessAction, getLoggedInUserSuccessAction } from './app.action';
import { loginAction, loginSuccessAction, logoutAction, logoutSuccessAction } from '../modules/auth/store/auth.action';
import { IAvailableExchangeRate, ICountry, ILeaveSetup, ILocationNavMenu, IMultiSelectEmployee, IOrganizationalUnit, IPassportCountryCodes, IPayPeriod, IPaymentMethod, IPaypoint, IUser } from '../models/generic.model';
import { IEmployeeShift } from '../modules/employee/employee.model';
import { ITodoListWidgetData } from '../models/dashboard.model';

export interface GenericState {
  isLoading: boolean;
  hasError?: boolean;
}
export interface InitAppState {
  isLoading: boolean,
  token: string;
  isLoggedIn: boolean;
  isLoginFailed: boolean;
  loginError: string;
  countries: ICountry[];
  organizationalUnits: IOrganizationalUnit[];
  paymentMethods: IPaymentMethod[];
  payPoints: IPaypoint[];
  payPeriods: IPayPeriod[];
  locationNavMenu: ILocationNavMenu;
  availableExchangeRates: IAvailableExchangeRate[];
  employeeShifts: IEmployeeShift[];
  passportCountryCodes: IPassportCountryCodes[];
  leaveSetupLocation: ILeaveSetup[];
  timeOffSetupPolicies: ILeaveSetup[];
  payPointsCurrentUser: IPaypoint[];
  todoListWidgetData: ITodoListWidgetData;
  multiSelectEmployees: IMultiSelectEmployee[];
  leaveSetups: ILeaveSetup[];
  loggedInUser: IUser;
}
export const initialState: InitAppState = {
  isLoading: undefined,
  token: undefined,
  isLoggedIn: undefined,
  isLoginFailed: undefined,
  loginError: undefined,
  countries: [],
  organizationalUnits: [],
  paymentMethods: [],
  payPoints: [],
  payPeriods: [],
  locationNavMenu: undefined,
  availableExchangeRates: [],
  employeeShifts: [],
  passportCountryCodes: [],
  leaveSetupLocation: [],
  timeOffSetupPolicies: [],
  payPointsCurrentUser: [],
  todoListWidgetData: undefined,
  multiSelectEmployees: [],
  leaveSetups: [],
  loggedInUser: undefined
};
const initAppReducer = createReducer(
  initialState,
  on(getLoggedInUserSuccessAction, (state, action) => {
    return Object.assign({}, state, { loggedInUser: action.response });
  }),
  on(getLeaveSetupsSuccessAction, (state, action) => {
    return Object.assign({}, state, { leaveSetups: action.response?.items || [] });
  }),
  on(getMultiSelectEmployeesSuccessAction, (state, action) => {
    return Object.assign({}, state, { multiSelectEmployees: action.response });
  }),
  on(getTodoListWidgetDataSuccessAction, (state, action) => {
    return Object.assign({}, state, { todoListWidgetData: action.response });
  }),
  // on(getEmployeeFieldsByCountrySuccessAction, (state, action) => {
  //   return Object.assign({}, state, { employeeCountryFields: action.response });
  // }),
  on(getPayPointsForCurrentUserSuccessAction, (state, action) => {
    return Object.assign({}, state, { payPointsCurrentUser: action.response });
  }),
  on(getLeaveTimeOffSetupsPoliciesSuccessAction, (state, action) => {
    return Object.assign({}, state, { timeOffSetupPolicies: action.response });
  }),
  on(getLeaveSetupLocationSuccessAction, (state, action) => {
    return Object.assign({}, state, { leaveSetupLocation: action.response });
  }),
  on(getPassportCountryCodesSuccessAction, (state, action) => {
    return Object.assign({}, state, { passportCountryCodes: action.passportCountryCodes });
  }),
  on(getEmployeeShiftsSuccessAction, (state, action) => {
    return Object.assign({}, state, { employeeShifts: action.employeeShifts });
  }),
  on(getAvailableExchangeRatesSuccessAction, (state, action) => {
    const { data } = action.availableExchangeRatesResponse;
    return Object.assign({}, state, { availableExchangeRates: data });
  }),
  on(getMenuLocationsSuccessAction, (state, action) => {
    return Object.assign({}, state, { locationNavMenu: action.locationNavMenu });
  }),
  on(getPayPeriodsSuccessAction, (state, action) => {
    return Object.assign({}, state, { payPeriods: action.response });
  }),
  on(getPayPointsSuccessAction, (state, action) => {
    return Object.assign({}, state, { payPoints: action.payPoints });
  }),
  on(getPaymentMethodSuccessAction, (state, action) => {
    return Object.assign({}, state, { paymentMethods: action.paymentMethods });
  }),
  on(getOrganizationalUnitsSuccessAction, (state, action) => {
    return Object.assign({}, state, { organizationalUnits: action.organizationalUnits });
  }),
  on(getCountriesSuccessAction, (state, action) => {
    return Object.assign({}, state, { countries: action.countries });
  }),
  on(initAppSuccessAction, (state, action) => {
    let isLoggedIn: boolean = false;
    const token = action?.token || undefined;
    if (token)
      isLoggedIn = true;
    return Object.assign({ ...state, token, isLoggedIn });
  }),
  on(initSetTokenAction, (state, action) => {
    let isLoggedIn: boolean = false;
    let token = action?.token;
    if (token) {
      isLoggedIn = true;
      token = JSON.stringify(token)
    }
    return Object.assign({ ...state, token, isLoggedIn });
  }),
  on(loginAction, (state) => {
    return Object.assign({ ...state, isLoading: true });
  }),
  on(loginSuccessAction, (state, action) => {
    let isLoggedIn: boolean = false;
    const token = action?.response?.token || undefined;
    if (token)
      isLoggedIn = true;
    return Object.assign({ ...state, token, isLoggedIn, isLoading: false });
  }),
  on(logoutAction, (state) => {
    state = undefined;
    return Object.assign({}, state, { token: undefined, isLoggedIn: undefined });
  }),
  on(logoutSuccessAction, (state) => {
    return Object.assign({}, state, {});
  }),
  on(loginFailedAction, (state, action) => {
    return Object.assign({}, state, { isLoginFailed: true, loginError: action.error, isLoading: false })
  }),
);
export function InitAppReducer(state: InitAppState, action: Action) {
  return initAppReducer(state, action);
}

