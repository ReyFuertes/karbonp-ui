import { IEntitlementPolicy, ILeaveSetup, IOptionItem, ITimeOffActivity } from "src/app/models/generic.model";
import { IPostalAddress, IResidentialAddress, IRules } from "../people/people.model";
import { AppMenuType } from "src/app/models/generic.enum";
import { IPayslip } from "../payroll/payroll.model";

export interface IEmployeeDynamicFields {
  id: number;
  bankAccountDetails?: any;
  basics?: any;
  biography?: any;
  countryName?: any;
  emergencyContacts?: any;
  postalAddress?: any;
  residentialAddress?: any;
}
export interface IDynamicFormField {
  name: string;
  type: 'text' | 'email' | 'dropdown' | 'switch' | 'date' | 'hidden' | 'editor';
  required: boolean;
  value?: string | number | boolean;
  options?: IOptionItem[];
  groupName?: string;
}
export enum OffboardReasonType {
  Dismissed = 'dismissed',
  Resigned = 'resigned',
  ContractFinished = 'contract finished',
  Retired = 'retired',
  Redundancy = 'redundancy',
  Other = 'other'
}
export interface IApplication {
  id: string;
  name: string,
  menuType?: AppMenuType,
  description?: string,
  options: any;
}
export interface IEmployeeTimeOffBookingsOverview {
  employeeId: number;
  firstName: string;
  fromDate: string;
  lastName: string;
  leaveType: string;
  middleName?: string;
  toDate: string;
}
export interface IEmployeeTimeOffActivity {
  currentBalance?: number;
  employeeId?: number;
  fromDate?: string;
  toDate?: string;
  id: number;
  leaveExpiryDate?: string;
  leaveExpiryDays?: number;
  leaveSetup: ILeaveSetup;
  timeOffActivities: ITimeOffActivity[];
  dateRange?: IOptionItem[];
  selectedDateRange?: IOptionItem;
}
export interface IEmployeeTimeOffTakeOn {
  accrued?: number;
  closingBalance?: number;
  cycleEnd?: string;
  cycleStart?: string;
  employeeId: number;
  endOfTakeOnPeriod?: any;
  leaveSetup?: ILeaveSetup;
  previousCycleBalance?: number;
  taken?: number;
  leaveSetupId?: number;
}
export interface IEmployee {
  id: number;
  active?: boolean;
  addedByUserId?: number;
  addedDateTime?: string
  alternativeIdentificationNumber?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankAccountType?: number;
  bankBranchCode?: number;
  bankId?: number;
  bankRoutingNumber?: number;
  dateOfAppointment?: string;
  dateOfBirth?: string;
  dateOfSeniority?: Date;
  email?: string;
  firstName?: string;
  fullName?: string;
  hdmfNo?: string;
  holderRelationship?: string;
  identificationNumber?: string;
  identificationType?: number;
  incomeTaxNumber?: string;
  jobTitle?: string;
  landLine?: string;
  lastName?: string;
  location?: number;
  middleName?: string;
  mobileNumber?: string;
  number?: string;
  organizationalUnit?: number;
  passportCountryCode?: number;
  payFrequency?: number
  payPointId?: number;
  paymentMethod?: number;
  philippineHealthNo?: string;
  postalAddress?: IPostalAddress;
  residentialAddress?: IResidentialAddress;
  rules?: IRules;
  selfServiceEnabled?: boolean;
  updatedByUserId?: number;
  updatedDateTime?: string;
  peopleStatus?: number;
  biographyDo?: string;
  biographyAbout?: string;
  avatarPath?: string;
  emergencyContacts?: {
    id?: number;
    fullName: string,
    phone: string,
    phoneAlternative: string,
    relationship: string
  }[];
  isInvited?: boolean;
  employeeId?: number;
  payslip?: IPayslip;
  copyNotesOver?: boolean;
  copyPrivateNotesOver?: boolean;
  notes?: string;
  privateNotes?: string;
  status?: number;
  amount?: number;
}
export interface IEmployeeTimeOffPolicy {
  employeeId: number;
  timeOffPolicyId?: number;
  timeOffPolicyName?: string;
  timeOffSetupId: number;
  timeOffSetupName?: string;
  entitlementPolicies?: IEntitlementPolicy[];
}
export interface ITimeOffAdjustment {
  addedByUserId?: number;
  addedDateTime?: string;
  amount?: number;
  date?: string;
  description?: string;
  employeeId?: number;
  id: number;
  leaveSetupId?: number;
  rules: any;
  updatedByUserId?: number;
  updatedDateTime?: string;
}
export interface ITimeOffActivityPayload {
  language?: string;
  employeeId: number;
  toDate?: string;
  leaveSetupId?: number;
  isTimeOffBookingCalculation?: boolean;
  isEmployeePortalRequest?: boolean;
}
export interface IEmployeeTakeOn {
  addedByUserId?: number;
  addedDateTime?: string;
  basicSalaryTaxable: number;
  deminimisBenefitsNonTaxable: number;
  employeeId: number;
  hdmfContributionsNonTaxable: number;
  id: number;
  phicContributionsNonTaxable: number;
  rules: any
  salariesOtherCompensationNonTaxable: number;
  salariesOtherCompensationTaxable: number;
  sssContributionsNonTaxable: number;
  taxWithheld: number;
  thirteenthMonthPayOtherBenefitsNonTaxable: number;
  thirteenthMonthPayOtherBenefitsTaxable: number;
  totalIncomeNonTaxable?: number;
  totalIncomeTaxable?: number;
  updatedByUserId?: number;
  updatedDateTime?: string;
}
export interface IEmployeeSkillsEquity {
  addedByUserId?: number;
  addedDateTime?: string;
  disabled?: boolean;
  employee: IEmployee;
  employeeId: number;
  foreignNational?: boolean;
  gender?: number;
  id: number;
  jobValue?: number;
  maritalStatus?: number;
  natureOfDisability?: string;
  notRSACitizen?: number;
  numberOfDependents?: number;
  occupationCategory?: number;
  occupationLevel?: number;
  passportCountryCodeId?: number;
  province?: string;
  race?: number;
  rules: any
  updatedByUserId?: number;
  updatedDateTime?: string;
}
export interface IEmployeeService {
  addedByUserId?: number;
  addedDateTime?: string;
  employeeId: number;
  expectedReturnDate?: string;
  id: number;
  lastDayOfService?: string;
  notes?: string;
  paidDuringTemporaryAbsence: boolean;
  payOutLeaveOnTermination: boolean;
  reinstatementDate?: string;
  rules: any
  statusReason?: number;
  updatedByUserId?: number;
  updatedDateTime?: string;
  deactivateEmployee?: boolean;
}
export interface IEmployeeShiftPayload {
  active: boolean;
  excludeNightShift: boolean;
  implementSortingAndPaging: boolean;
  sortBy: string;
}
export interface IEmployeeShift {
  active: boolean;
  allowOverTimeHours: boolean;
  id: number;
  name: string;
}
export enum EmployeeWorkingOptionType {
  Off = 0,
  Normal = 1,
  Partial = 2
}
export interface IEmployeeWorkingHour {
  addedByUserId?: number;
  addedDateTime?: string;
  annualWorkingDays: 261
  annualWorkingDaysOverride: 312
  employeeId: 312251
  fridayHours?: number;
  fridayType?: number;
  fullDaysPerWeek?: number;
  fullDaysPerWeekOveride?: number;
  hoursPerDay?: number;
  id: 222265
  mondayHours?: number;
  mondayType?: number;
  rules: any;
  saturdayHours?: number;
  saturdayType?: number;
  schedule?: number;
  shiftId?: number;
  sundayHours?: number;
  sundayType?: number;
  thursdayHours?: number;
  thursdayType?: number;
  tuesdayHours?: number;
  tuesdayType?: number;
  updatedByUserId?: number;
  updatedDateTime?: string;
  wednesdayHours?: number;
  wednesdayType?: number;
  hasFullDaysPerWeekOveride?: boolean;
  hasAnnualWorkingDaysOverride?: boolean;
}
