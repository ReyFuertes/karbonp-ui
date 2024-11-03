import { createSelector } from '@ngrx/store';
import { AppState } from '.';

export const selectedState = (state: AppState) => state.app;
export const getLoggedInUserSelector = createSelector(
  selectedState,
  state => state?.loggedInUser || undefined);
export const getLeaveSetupsSelector = createSelector(
  selectedState,
  state => state?.leaveSetups || []);
export const getMultiSelectEmployeesSelector = createSelector(
  selectedState,
  state => state?.multiSelectEmployees || []);
export const getTodoListWidgetDataSelector = createSelector(
  selectedState,
  state => state?.todoListWidgetData || undefined);
export const getPayPointsCurrentUserSelector = createSelector(
  selectedState,
  state => state?.payPointsCurrentUser || []);
export const getLeaveTimeOffSetupPoliciesSelector = createSelector(
  selectedState,
  state => state?.timeOffSetupPolicies || []);
export const getLeaveSetupLocationSelector = createSelector(
  selectedState,
  state => state?.leaveSetupLocation || []);
export const getPassportCountryCodesSelector = createSelector(
  selectedState,
  state => state?.passportCountryCodes || []);
export const getEmployeeShiftsSelector = createSelector(
  selectedState,
  state => state?.employeeShifts || []);
export const getAvailableExchangeRatesSelector = createSelector(
  selectedState,
  state => state?.availableExchangeRates || []);
export const getLocationNavMenuSelector = createSelector(
  selectedState,
  state => state?.locationNavMenu);
export const getPayPeriodsSelector = createSelector(
  selectedState,
  state => state?.payPeriods || []);
export const getPayPointsSelector = createSelector(
  selectedState,
  state => state?.payPoints?.filter(points => points.name !== null) || []);
export const getPaymentMethodsSelector = createSelector(
  selectedState,
  state => state?.paymentMethods || []);
export const getOrganizationalUnitsSelector = createSelector(
  selectedState,
  state => state.organizationalUnits || []);
export const getCountriesSelector = createSelector(
  selectedState,
  state => state.countries || []);
export const isUserLoggedInSelector = createSelector(
  selectedState,
  state => state.isLoggedIn);
export const getIsLoginFailedSelector = createSelector(
  selectedState,
  state => state?.isLoginFailed);
export const getTokenSelector = createSelector(
  selectedState,
  state => state?.token);
export const isAppLoadingSelector = createSelector(
  selectedState,
  state => state?.isLoading || false);
