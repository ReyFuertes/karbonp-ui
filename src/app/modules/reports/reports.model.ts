import { IPassportCountryCodes, IPaymentMethod } from "src/app/models/generic.model";
import { IEmployee } from "../employee/employee.model"

export interface IMonthlySettingReport {
  id: number,
  includeEmployeeReport?: boolean,
  includeDetailedPayrollReport?: boolean,
  includeBalancesReport?: boolean,
  includeEtiReport?: boolean,
  includePayrollReport?: boolean,
  sendAsOneReportFile?: boolean,
  language?: string;
  enabled?: boolean
}
export interface ISaveTemplateReportPayload {
  id: number;
  name: string;
  selectedColumns: string[];
  fromDate: string;
  toDate: string;
  selectedCustomPeriod: number;
  selectedEmployees: number[];
  selectedPayPeriods: string[];
  selectedPayPoints: string[];
  selectedPayrunStatus: string[];
}
export interface ISaveTemplateReportReponse {
  id: number;
  name: string;
  selectedColumns: string;
  fromDate: string;
  selectedCustomPeriod: number;
  selectedEmployees: string;
  selectedPayPeriods: string;
  selectedPayPoints: string;
  selectedPayrunStatus: string;
  toDate: string;
}
export interface IReportDataResponse {
  detailedPayrollReportViews: IDetailedPayrollReportView[];
  payItemTotals: IPayItemTotals[]
}
export interface IPayItemTotals {
  currencySymbolOverride: string;
  isCurrency: boolean;
  name: string;
  value: number;
}
export interface IDetailedPayrollReportView {
  distinctPayItems: { GrossPay: number, NetPay: number, CostToCompany: number };
  employeeId: number;
  employeeName: string;
  employeeNumber: string;
  organizationalUnit: string;
  payDate?: string;
  payItems: [{ name: string, value: number, isCurrency: boolean, currencySymbolOverride: string }];
  payPoint?: string;
  payRunDate: string;
  payslipId: number;
}
export interface IReportResponse {
  employee: IEmployee;
  garnishee: number;
  loans: number;
  organizationalUnit: string;
  savings: number;
  employeeService: any;
  organizationalUnitDisplayName: string;
  passportCountryCode: IPassportCountryCodes;
  paymentMethod: IPaymentMethod;
  postalAddressCountry: string
  residentialAddressCountry: string
}
export interface IPayloadReport {
  date?: string;
  dates?: string;
  fromDate?: string;
  toDate?: string;
  employeeIds?: number[];
  implementSortingAndPaging: boolean;
  language: string
  payPeriodids?: number[];
  payPointIds?: number[]
}
export interface IMenuReport {
  route: string;
  label: string;
  icon: string;
}