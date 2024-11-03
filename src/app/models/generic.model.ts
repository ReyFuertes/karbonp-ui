import { IEmployee, IEmployeeWorkingHour } from "../modules/employee/employee.model";
import { SBCPantryVoucherCalculationType, TaxMethod } from "../modules/people/people.model";
import { UserRole } from "./generic.enum";

export interface IUser {
  firstName: string;
  lastName: string;
  password: string;
  landLine: string;
  cellNumber: string;
  email: string;
  active: boolean;
  role: UserRole;
  resetPasswordKey?: string;
  canUpdateReferenceData: boolean;
  canCompletePayRun: boolean;
  canExportEFT: boolean;
  accountId?: number;
}
export interface ICoidaSetting {
  annualCap: number;
  defaultGrowthPercentage: number;
}
export interface IetiCalculationItem {
  amount: number;
  etiCalculationItemApplicablePeriod: number;
  etiCalculationItemType: number;
  fromAmount: number;
  id: number;
  percentage: number;
  toAmount: number;
}
export interface IMedicalAidTaxCredit {
  creditForFirstMember: number;
  creditForSecondMember: number;
  creditForThreeOrMoreMembers: number;
}
export interface IRetirementAnnuityFundLimit {
  annualMonetaryCap: number;
  taxablePercentage: number;
}
export interface ISubsistenceAllowanceLimit {
  incidentalDailyLimit: number;
  medicalAndIncidentalDailyLimit: number;
}
export interface ISouthAfricaRegulatedSetting {
  coidaSettings: ICoidaSetting;
  donationTaxDeductiblePercentage: number;
  etiCalculationSettings: {
    fromDate: string;
    hasETISettings: boolean;
    id: number;
    etiCalculationItems: IetiCalculationItem[],
    etiHoursToUse: number;
    maxRemunerationCap: number;
  },
  medicalAidTaxCredits: IMedicalAidTaxCredit[],
  retirementAnnuityFundLimit: IRetirementAnnuityFundLimit;
  subsistenceAllowanceLimit: ISubsistenceAllowanceLimit;
  travelAllowanceRateThresholds: { rate: number };
  uifLimits: { uifYearlyLimit: number };
}
export interface IEmployeeActivityLog {
  employeeId: number;
  userId: number;
  userFullName: string;
  date: string;
  action: string;
  actions: string[]; //note: temporary variable to avoid errors
  payslipId?: number;
  payRunId?: number;
}
export interface IAdditionalSettings {
  christmasBonusDaysPaid?: number;
  maximumSavingsFundRate?: number;
  uMADailyValueOverride?: number;
  sBCCalculationType: number;
  sBCPantryVoucherCalculationType: SBCPantryVoucherCalculationType;
  nightDifferentialContributionPercentage?: number;
  taxMethod: TaxMethod
}
export interface IXeroTenant {
  accounts: any[]; //note: model this
  authEventId: string;
  connected: true
  createdDateUtc: string;
  id: number;
  locationId: number;
  rules: any;
  tenantId: string;
  tenantName: string;
  tenantShortCode: string;
  tenantType: string;
  updatedByUserId: number;
  updatedDateTime: string;
}
export interface ITaxPeriodDate {
  fromDate: string;
  isMidTaxSeason?: boolean;
  toDate: string;
}
export interface IMultiSelectEmployee {
  id: number,
  fullName: string;
  isActive?: boolean;
}
export interface ITokenDetails {
  CurrentAccountId: string;
  CurrentCompanyId: string;
  CurrentCountryCurrency: string;
  CurrentCountryCurrencySymbol: string;
  CurrentCountryIsoCode: string;
  CurrentLocationCountry: string;
  CurrentLocationCountryId: string;
  CurrentLocationId: string;
  LogInType: string;
  exp: number;
  iat: number;
  nameid: string;
  nbf: number;
  role: string;
  unique_name: string;
}
export interface IUserAvatar {
  avatarUrl: string;
  employeeId: number;
}
export interface ISimplePayload {
  active: boolean,
  implementSortingAndPaging: boolean
}
export interface ITimeOffRequestPayload {
  employeeIds?: number[];
  fromDate?: string;
  leaveTypeIds?: number[];
  toDate?: string;
  pageNumber?: number;
  pagesize?: number;
  sortAscending?: boolean;
  sortBy?: string;
  status?: number;
  payPointId?: number;
  userId?: number;
}
export interface IEntitlementPolicy {
  addedByUserId?: number;
  addedDateTime?: string;
  allowLeaveToBeCarriedForward?: boolean;
  customName?: string;
  cycleEntitlementRegulations?: [];
  defaultEntitlementInDays?: any;
  entitlementAvailableAfterMonths?: number;
  id: any;
  leaveCarriedForwardExpiredInMonths?: number;
  limitAmount?: number;
  limitType?: number;
  maximumBalanceLimit?: number;
  oneHourOfLeaveForEveryXHoursWorked?: number;
  rules?: { customName: [any] };
  updatedByUserId?: number;
  updatedDateTime?: string;
  useHoursWorkedForAccrual?: boolean;
  useUpfrontAccrual?: boolean;
}
export enum EmployeeRequestStatusType {
  Declined = 0,
  Approved = 1,
  Requested = 2
}
export enum TimeOffType {
  Partial = 1,
  Fullday = 2
}
export interface IEmployeeTimeOffBookings {
  dateItems: string[],
  employeeRegularHours: IEmployeeWorkingHour,
  timeOffBookings: ITimeOffBooking[]
}
export interface ITimeOffBooking {
  approvedDeclinedByName: string;
  timeOffBooking: {
    addedByUserId?: number;
    addedDateTime?: string;
    approveDeclineNote?: string;
    approvedDeclinedBy?: number;
    approvedDeclinedDate?: string;
    employeeId?: number;
    fromDate?: string;
    id?: number;
    leaveSetup: ILeaveSetup;
    note?: string;
    requestedDate?: string;
    rules: { ToDate: [any] }
    status?: number;
    timeOffBookingItems: ITimeOffBookingItem[],
    toDate?: string;
    updatedByUserId?: number;
    updatedDateTime?: string;
  },
  employee?: IEmployee;
  totalDays: number;
}
export interface ITimeOffBookingItem {
  addedByUserId?: number;
  addedDateTime?: string;
  date?: string;
  hours?: number;
  id?: number;
  rules?: any
  timeOffBookingId?: number;
  timeOffType?: number;
  updatedByUserId?: number;
  updatedDateTime?: string;
}
export interface ILatestTimeBalance {
  leaveExpiryDate?: string;
  leaveExpiryDays: number;
  leaveSetup: ILeaveSetup;
  timeOffActivity: ITimeOffActivity;
  leaveType?: string;
  balance?: number;
}
export interface ITimeOffActivity {
  accrual: number;
  adjustments: number;
  balanceValue: number;
  closingBalance: number;
  expired: number;
  isFutureBalance: boolean;
  month?: string;
  openingBalance: number;
  taken: number;
}
export interface IEntitlementPolicyRange {
  fromDate: string;
  id: number,
  leaveEntitlementPolicy: IEntitlementPolicy;
  rules?: any
  toDate: string;
}
export interface ILeaveSetup {
  id: number;
  name: string;
  active?: boolean;
  icon?: string;
  autoPayFourtyPercentAfterThreeConsecutiveDays?: boolean;
  blockNegativeLeaveBalance?: boolean;
  cycleCustomDate?: string;
  cycleLength?: number;
  cycleType?: number;
  entitlementPolicies?: IEntitlementPolicy[];
  entitlementPolicyRanges?: IEntitlementPolicyRange[];
  hideBalancesInSelfService?: boolean;
  isUnpaidLeave?: false;
  locationId?: number;
  minimumBalace?: number;
  payVacationPremiumOnAnniversary?: false;
  ruleOverridePermission?: number;
  rules?: { Name: [any] }
  timeOffSystemType?: number;
  payFrequencyType?: number;
}
export interface IPassportCountryCodes {
  addedByUserId: number;
  addedDateTime: string;
  code: string;
  country: string;
  id: number;
  rules: { Code: [any], Country: [any] }
  updatedByUserId: number;
  updatedDateTime?: string;
}
export enum MaritalStatusType {
  Single = 1,
  Married = 2,
  Divorced = 3,
  Widowed = 4
}
export enum GenderType {
  Male = 1,
  Female = 2,
}
export enum RaceType {
  African = 1,
  Indian = 2,
  Coloured = 3,
  White = 4,
}
export enum OccupationLevelType {
  TopManagement = 1,
  SeniorManagement = 2,
  ProfSpecialistsAndMidManagement = 3,
  SkilledWorkersJuniorManagementSupervisors = 4,
  SemiSkilledAndDiscretionaryDecisionMakingManagement = 5,
  UnskilledAndDefinedDecisionMaking = 6,
}
export enum OccupationCategoryType {
  LegislatorsSeniorOfficialsAndManagers = 1,
  Professionals = 2,
  TechniciansAndAssociateProfessionals = 3,
  Clerks = 4,
  ServiceAndSalesWorkers = 5,
  SkilledAgriculturalAndFisheryWorkers = 6,
  CraftAndRelatedTradesWorkers = 7,
  PlantAndMachineOperatorsAndAssemblers = 8,
  ElementaryOccupations = 9,
}
export enum JobValueType {
  OperationalAndCoreFunction = 1,
  SupportFunction = 2,
}
export enum ProvinceType {
  Gauteng = 1,
  FreeState = 2,
  EasternCape = 3,
  KwaZuluNatal = 4,
  Mpumalanga = 5,
  Limpopo = 6,
  NorthernCape = 7,
  NorthWest = 8,
  WesternCape = 9,
}
export interface ICommonResponse {
  awaitingBackgroundTask: boolean
  data?: any;
  errorMessage?: string;
  errors: []
  savedObjectId?: number;
  success: boolean;
  token?: string;
}
export interface IDocumentNote {
  categoryId?: number;
  document?: string
  documentName?: string
  employeeId: string
  id: number;
  name?: string
  note?: string
}
export interface IEmployeeService {
  employeeId: number,
  isReinstatement: boolean,
  lastDayOfService: string,
  reinstatementDate?: string
}
export enum StatusReasonCodeType { //note: this has almost the same props with Ioffboardreason
  Deceased = 1,
  Retired = 2,
  Dismissed = 3,
  ContractExpired = 4,
  Resigned = 5,
  ConstructiveDismissal = 6,
  InsolvencyLiquidation = 7,
  MaternityAdoption = 8,
  LongTermLeaveDueToIllnessStillEmployed = 9,
  RetrenchedStaffReduction = 10,
  TransferToAnotherBranch = 11,
  Absconded = 12,
  BusinessClosed = 13,
  Redundancy = 14,
  LaborSavingDevices = 15,
  HealthRisk = 16
}
export interface IExchangeItem {
  addedByUserId?: number;
  addedDateTime?: string;
  exchangeRateDate?: string;
  exchangeRateId: number;
  exchangeRateValue: number;
  id: number;
  rules: any
  updatedByUserId?: number;
  updatedDateTime?: number;
}
export interface IAvailableExchangeRate {
  active: boolean;
  countryId: number;
  exchangeRateItems: IExchangeItem[];
  fromCurrency?: string;
  fromCurrencyFlagPath?: string;
  fromCurrencySymbol?: string;
  id: 0
  lastSyncedDateTime?: string;
  rules: any;
  syncDateTime?: string;
  timeZone?: string;
  toCurrency?: string;
  toCurrencyFlagPath?: string;
  toCurrencySymbol?: string;
}
export enum PaymentType {
  Monthly = 0,
  Fixed = 1,
  Daily = 2,
  Hourly = 3,
}
export interface IDesignationPayload {
  directorOfCompanyMemberOfCc: boolean;
  doYouHaveAWrittenDeclaration: boolean;
  doesTheEmployeeWorkAtLeast5Hours: boolean;
  employeeId?: number;
  employmentType?: number;
  excludeFromGovernmentContributions: boolean;
  exemptFromTax: boolean;
  geographicArea?: string;
  id?: number;
  independantContractor: boolean;
  isManagerOrSupervisor: boolean;
  isUnionizedWorker: boolean;
  jobRisk?: string;
  lessThan24HoursAMonth: boolean;
  paySdl: boolean;
  paymentAmount?: number;
  paymentAmountCurrency?: number;
  paymentType?: number;
  taxRegime?: string;
  uifExempt: boolean;
  uifExemptReason?: string;
}
export interface IDesignation {
  addedByUserId: number;
  addedDateTime: string;
  directorOfCompanyMemberOfCC: boolean;
  doYouHaveAWrittenDeclaration: boolean;
  doesTheEmployeeWorkAtLeast5Hours: boolean;
  employeeId: number;
  employmentType: number;
  excludeFromGovernmentContributions: boolean;
  exemptFromTax: boolean;
  geographicArea?: string;
  id: number;
  independantContractor: boolean;
  isManagerOrSupervisor: boolean;
  isUnionizedWorker: boolean;
  jobRisk?: string;
  lessThan24HoursAMonth: boolean;
  paySDL: boolean;
  paymentAmount: number;
  paymentAmountCurrency: number;
  paymentType: number;
  rules: any;
  taxRegime?: string;
  uifExempt: boolean;
  uifExemptReason?: string;
  updatedByUserId?: number;
  updatedDateTime?: string;
}
export interface INavMenu {
  countryFlagPath: string;
  countryId: number;
  countryName: string;
  navMenuViewModelItems: {
    companyId: number;
    companyName: string;
    dropDownItemText: string;
    dropDownSelectionText: string;
    locationHasPassword: boolean;
    locationId: number;
    locationName: string;
  }[]
}
export interface ILocationNavMenu {
  data: INavMenu[];
}
export interface IPayPeriod {
  active: boolean;
  addedByUserId?: number;
  addedDateTime?: string;
  autoMergeCompletedPayRuns: boolean;
  firstPayrollPeriodEndDate?: string;
  hdmfSettings: IPayPeriodSetting;
  id: number;
  interimDayOfMonth?: number;
  lastDayOfMonth: null
  locationId?: number;
  name: string;
  payFrequencyType?: number;
  payOnLastDayOfMonth: boolean;
  payrollCalculationDaysSetting: null
  phicSettings: IPayPeriodSetting;
  rules: { PayFrequencyType: [any], Name: [any] }
  secondPayOnLastDayOfMonth: boolean;
  socialSecuritySettings: IPayPeriodSetting
  twiceMonthlyStartingOnSecondPayDate?: boolean;
  updatedByUserId?: number;
  updatedDateTime?: string;
}
export interface IPayPeriodSetting {
  contributionBase: number;
  evenSplitOnDeduction: boolean;
  firstPeriod: boolean;
  firstWeek: boolean;
  fourthWeek: boolean;
  lastPeriod: boolean;
  secondPeriod: boolean;
  secondWeek: boolean;
  thirdWeek: boolean;
}
export interface IPaypoint {
  id: number;
  name?: string;
  active?: boolean;
  locationId?: number;
  additionalSettings: IAdditionalSettings;
}
export interface IPaginationPayload {
  active?: boolean;
  pageNumber?: number;
  pagesize?: number;
  sortBy?: string;
  sortAscending?: boolean;
  payFrequencyId?: number;
}
export interface IPaymentMethod {
  active?: boolean;
  addedByUserId?: number;
  addedDateTime?: string;
  id: number;
  name?: string;
  rules?: { Name: [any] }
  updatedByUserId?: number;
  updatedDateTime?: number;
}
export interface IOrganizationalUnit {
  id: number;
  name: string;
  code: string;
  displayName: string;
  parentId?: number;
  parent?: any;
  parentDisplayName?: string;
  active: boolean,
  children: any[]
}
export interface ICountry {
  addedByUserId?: number;
  addedDateTime: string;
  billingBaseFeeAddOnCode: string;
  billingHeadcountAddOnCode: string;
  billingPlanCode: string;
  currency: string;
  currencySymbol: string;
  dialingCode?: number;
  flagPath: string;
  id: number
  isoCode: string;
  name: string;
  regionalApiURL: string;
  rules: any;
  timeZone: string;
  updatedByUserId?: number;
  updatedDateTime: string;
}
export interface IPaginator {
  pageNumber: number;
  pagesize: number;
}
export interface IOptionItem {
  icon?: string;
  imageUrl?: string;
  label: string;
  value?: any;
  id?: string | number;
  name?: string;
  route?: string;
  items?: IOptionItem[];
  active?: boolean;
}