import { IPayPeriod } from "./generic.model"

export interface ITodoListWidgetData {
  inactiveEmployees?: {
    employeeId: number,
    firstName: string,
    lastName: string,
  }[],
  officialBusinessRequests?: {
    employeeName: string,
    fromDate: string,
    toDate: string,
  }[];
  overtimeRequests?: {
    employeeName: string,
    date: string
  }[];
  pendingPayments?: {
    amount: number,
    employeeCount: number,
    id: number,
    payPeriod: IPayPeriod,
    payRunDate: string,
    payRunId: number,
    payRunName?: string,
    paymentDate: string,
    status: number,
    thirdPartyReference?: string,
    transactionFeeTotal: number
  }[],
  timeOffRequests?: {
    employeeId: number,
    firstName: string,
    lastName: string,
    timeOffBookingId: number,
    timeOffType: string
  }[],
  toDoListDraftPayslipsViews?: {
    payFrequencyType: string,
    payRunDate: string,
    payRunId: number,
    payslipCount: number
  }[]
}
export interface IPeople {
  name: string;
  image?: string;
  initials?: string;
}

export interface IMenuApp {
  name: string;
  description?: string;
  value?: string;
  icon?: string;
  disabled?: boolean;
  route?: string;
  class?: string;
}