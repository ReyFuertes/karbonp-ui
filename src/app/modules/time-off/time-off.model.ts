import { ILatestTimeBalance } from "src/app/models/generic.model";

export interface ITimeOffPaginationPayload {
  employeeIds: number[],
  pageNumber: number,
  pagesize: number,
  sortAscending: boolean,
  sortBy: string,
  status: number
}
export interface IleaveApproverUser {
  active: boolean,
  email: string,
  firstName: string,
  hasActivatedAccount: boolean,
  id: number,
  lastName: string,
  role: number,
  userRole: string,
}
export interface ILeaveApprover {
  id: number;
  locationId?: number;
  payPointId?: number;
  payPointName?: string;
  userFullName?: string;
  userId?: number;
}
export interface IEntitlementPolicyPayload {
  allowLeaveToBeCarriedForwardToNextCycle: boolean;
  customName?: string;
  cycleEntitlementRegulations: ICycleEntitlementRegulation[];
  defaultEntitlementDays: number;
  entitlementOnlyAvailableAfterXMonths: number;
  id: number;
  leaveCarriedForwardExpiresAfterXMonths: number;
  leaveId: number;
  limitAmount: number;
  limitType: number;
  maximumBalanceLimit?: number;
  oneHourOfLeaveForEveryXHoursWorked?: number;
  useCustomName: boolean;
  useHoursWorkedForAccrual: boolean;
  useUpfrontAccrual: boolean;
}
export interface ICycleEntitlementRegulation {
  entitlement: number;
  firstCycle: string;
  id?: number; // not sure why we send this to api as 0
  lastCycle: string;
  vacationPremium?: string;
}
export interface ITimeOffBalanceReport {
  balances: ILatestTimeBalance[];
  employeeName: string;
  number: string;
  organizationalUnit: string;
}
export interface ITimeOffBalanceReportPayload {
  date: string;
  employeeIds: number[];
  pageNumber: number;
  pagesize: number;
  payPointIds: number[];
  sortAscending: boolean;
  sortBy: string;
}
export interface IPublicHoliday {
  addedByUserId?: number;
  addedDateTime?: string;
  country?: number;
  date?: string;
  id: number;
  isSpecialHoliday: false,
  name: string;
  rules: any,
  updatedByUserId?: number;
  updatedDateTime?: string;
}