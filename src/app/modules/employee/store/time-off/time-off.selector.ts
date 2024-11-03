import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EmployeeModuleState } from "..";

export const selectEmployeeModuleState = createFeatureSelector<EmployeeModuleState>('employeeModule');
export const getEmployeesTimeOffBookingsOverviewSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employeeTimeOff?.employeesTimeOffBookingsOverview);
export const getEmployeeTimeOffActivitiesSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employeeTimeOff?.employeeTimeOffActivities);
export const getEmployeeTimeOffTakeOnsSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employeeTimeOff?.employeeTimeOffTakeOns);
export const getEmployeeTimeOffPoliciesSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employeeTimeOff?.employeeTimeOffPolicies);
export const getEmployeeTimeOffAdjustmentsSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employeeTimeOff?.employeeTimeOffAdjustments);
export const getEmployeeTimeOffBookingsSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employeeTimeOff?.employeeTimeOffBookings);
export const getEmployeeLatestTimeBalanceSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employeeTimeOff?.employeeLatestTimeBalance);
export const IsTimeOffLoadingSelector = createSelector(
  selectEmployeeModuleState,
  state => state?.employeeTimeOff?.isLoading);

