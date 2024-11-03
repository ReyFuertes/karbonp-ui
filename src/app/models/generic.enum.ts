
export enum BooleanType {
  Yes = 'true',
  No = 'false'
}
export enum UserRole {
  KarbonPay = 0,
  AccountOwner = 1,
  AccountAdmin = 2,
  CompanyAdmin = 3,
  PayrollAdmin = 4,
  PayrollContractor = 5,
  Employee = 6,
  LeaveApprover = 7
}
export enum ContributionBase {
  Basic = 0,
  Gross = 1,
}
export enum DialogStateType {
  Add = 1,
  Edit = 2,
  View = 3
}
export enum ConfirmationSeverityType {
  Success = 1,
  Warning = 2,
  Error = 3,
}
export enum PayFrequencyType {
  Monthly = 1,
  Weekly = 2,
  EveryTwoWeeks = 3,
  TwiceMonthly = 4,
  Daily = 5,
  TenDaily = 6
}
export enum PhilippinesOvertimeTypes {
  PHLNightDifferentialOvertime = 114,
  PHLDoubleHolidayOT = 119,
  PHLDoubleHolidayNDOT = 121,
  PHLDoubleHolidayRestDayOT = 123,
  PHLDoubleHolidayRestDayNDOT = 125,
  PHLRegularHolidayOT = 128,
  PHLRegularHolidayNDOT = 130,
  PHLSpecialHolidayOT = 132,
  PHLSpecialHolidayNDOT = 134,
  PHLRestDayOT = 136,
  PHLRestDayNDOT = 138,
  PHLRegularHolidayRestDayOT = 140,
  PHLRegularHolidayRestDayNDOT = 142,
  PHLSpecialHolidayRestDayOT = 144,
  PHLSpecialHolidayRestDayNDOT = 146,
  PHLOvertime = 147
}
export enum IncomeType {
  BaseEarnings = 0,
  BaseHourlyPay = 1,
  Overtime = 2,
  ShortHours = 3,
  Sunday = 4,
  SundayOvertime = 5,
  PublicHolidayWorked = 6,
  PublicHolidayWorkedOvertime = 7,
  PublicHolidayNonWorked = 8,
  Commission = 9,
  ExtraPay = 10,
  LossOfIncomePayout = 11,
  Custom = 12,
  AnnualBonus = 13,
  AnnualPayment = 14,
  ArbitrationAwardTaxable = 15,
  ArbitrationAwardNonTaxable = 16,
  LeavePaidOut = 17,
  RestraintOfTrade = 18,
  MedicalAidBenefitPaidOut = 19,
  RetirementAnnuityFundBenefitPaidOut = 20,
  AnnualLeavePay = 21,
  SickLeavePay = 22,
  CompassionateLeavePay = 23,
  AnnualLeavePayExtra = 24,
  UnpaidLeave = 25,
  TravelAllowanceFixedCosts = 26,
  TravelAllowanceReimbursement = 27,
  TravelAllowanceReimbursementTaxable = 28,
  ExpenseClaim = 29,
  ComputerAllowance = 30,
  PhoneAllowance = 31,
  ToolAllowance = 32,
  UniformAllowance = 33,
  BroadBasedEmployeeSharePlan = 34,
  GainFromVestingEquity = 35,
  RelocationAllowanceTaxable = 36,
  RelocationAllowanceNonTaxable = 37,
  SubsistenceAllowanceInternationalUnderLimit = 38,
  SubsistenceAllowanceInternationalOverLimit = 39,
  SubsistenceAllowanceLocalUnderLimit = 40,
  SubsistenceAllowanceLocalOverLimit = 41,
  EmployerLoanBalanceIncrease = 42,
  SavingsPayout = 43,
  LeaveSetup = 44,
  ChristmasBonus = 46,
  Attendance = 47,
  Gym = 48,
  PantryVouchers = 49,
  GasolineVouchers = 50,
  TransportSubsidy = 51,
  EducationalScholarships = 52,
  DiningSubsidy = 53,
  TaxSubsidy = 54,
  Severance = 55,
  SpecialHolidayWorked = 66,
  SpecialHolidayWorkedOvertime = 57,
  SundayOvertimeLimitExceeded = 58,
  PublicHolidayOvertimeLimitExceeded = 59,
  PublicHolidaySundayOvertime = 60,
  PublicHolidaySundayOvertimeLimitExceeded = 61,
  SpecialHolidayNonWorked = 62,
  SpecialHolidayWorkedOvertimeLimitExceeded = 63,
  SpecialHolidaySundayOvertime = 64,
  SpecialHolidaySundayOvertimeLimitExceeded = 65,
  LimitExceededOvertime = 56,
  ShiftWorkedNormal = 67,
  ShiftWorkedOvertime = 68,
  ShiftSundayWorked = 69,
  ShiftSundayWorkedOvertime = 70,
  ShiftSundayWorkedOvertimeLimitExceeded = 71,
  ShiftPublicHolidayWorked = 72,
  ShiftPublicHolidayWorkedOvertime = 73,
  ShiftPublicHolidayWorkedOvertimeLimitExceeded = 74,
  ShiftPublicHolidaySundayWorkedOvertime = 75,
  ShiftPublicHolidaySundayWorkedOvertimeLimitExceeded = 76,
  ShiftSpecialHolidayWorked = 77, kedOvertime = 78,
  ShiftSpecialHolidayWorkedOvertimeLimitExceeded = 79,
  ShiftSpecialHolidaySundayWorkedOvertime = 80,
  ShiftSpecialHolidaySundayWorkedOvertimeLimitExceeded = 81,
  Retirement = 82,
  HolidaysNotEnjoyedSeverance = 83,
  HolidaysProRataSeverance = 84,
  HolidaysProRataPremiumSeverance = 85,
  ChristmasBonusProRataSeverance = 86,
  CompensationTwentyDaysPerYearForLiquidation = 87,
  IndemnityNinetyDaysForLiquidation = 88,
  SeniorityPremiumForLiquidation = 89,
  RetroactiveSalary = 90,
  MealAllowance = 91,
  ServiceIncentiveLeavePaidOut = 92,
  RiceSubsidy = 93,
  MedicalCashAllowance = 94,
  UniformAndClothingAllowance = 95,
  LaundryAllowance = 96,
  MedicalBenefit = 97,
  Gifts = 98,
  AchievementAward = 99,
  CBABenefit = 100,
  SeparationPay = 101,
  TaxRefund = 102,
  ThirteenthMonthPay = 103,
  PHLNightDifferential = 104,
  SundayPremium = 105,
  ProfitSharing = 106,
  TravelAllowance = 107,
  TaxDirectiveIncome = 111,
  TerminationLumpSum = 112,
  OfficialBusiness = 113,
  PHLNightDifferentialOvertime = 114,
  SpecialHolidaySundayWorked = 115,
  ShiftSpecialHolidaySundayWorked = 116,
  PublicHolidaySundayWorked = 117,
  PHLDoubleHoliday = 118,
  PHLDoubleHolidayOT = 119,
  PHLDoubleHolidayND = 120,
  PHLDoubleHolidayNDOT = 121,
  PHLDoubleHolidayRestDay = 122,
  PHLDoubleHolidayRestDayOT = 123,
  PHLDoubleHolidayRestDayND = 124,
  PHLDoubleHolidayRestDayNDOT = 125,
  ShiftPublicHolidaySundayWorked = 126,
  PHLRegularHoliday = 127,
  PHLRegularHolidayOT = 128,
  PHLRegularHolidayND = 129,
  PHLRegularHolidayNDOT = 130,
  PHLSpecialHoliday = 131,
  PHLSpecialHolidayOT = 132,
  PHLSpecialHolidayND = 133,
  PHLSpecialHolidayNDOT = 134,
  PHLRestDay = 135,
  PHLRestDayOT = 136,
  PHLRestDayND = 137,
  PHLRestDayNDOT = 138,
  PHLRegularHolidayRestDay = 139,
  PHLRegularHolidayRestDayOT = 140,
  PHLRegularHolidayRestDayND = 141,
  PHLRegularHolidayRestDayNDOT = 142,
  PHLSpecialHolidayRestDay = 143,
  PHLSpecialHolidayRestDayOT = 144,
  PHLSpecialHolidayRestDayND = 145,
  PHLSpecialHolidayRestDayNDOT = 146,
  PHLOvertime = 147
}
export enum RunPayslipStatusType {
  Draft = 0,
  Approved = 1
}
export enum CountryISOCodeType {
  PHL = 'PHL',
  MEX = 'MEX',
  ZA = 'ZA'
}
export enum CountryIdType {
  PHL = 3,
  MEX = 2,
  ZA = 1
}
export enum PayRunStatusType {
  InProgress = 0,
  Completed = 1,
  Approved = 2
}
export enum MessageErrorType {
  Success = 'success',
  Error = 'error',
  Warn = 'warn'
}
export enum DialogState {
  Add = 0,
  Edit = 1,
  View = 2
}
export enum FormState {
  add = 'add',
  edit = 'edit',
  view = 'view'
}
export enum EmploymentStatusType {
  NotInvited = 'NOT INVITED',
  Pending = 'PENDING',
  Onboarding = 'ONBOARDING',
  Active = 'ACTIVE',
  LongTermAbsence = 'LONG TERM ABSENCE',
  PendingOffboarding = 'PENDING OFFBOARDING',
  Offboarded = 'OFFBOARDED',
}
export enum AppDashboardType {
  Dashboard = 'Dashboard',
  People = 'People',
  TimeOff = 'Time Off',
  CompanyProfile = 'Company Profile',
  Expenses = 'Expenses',
  Reports = 'Reports',
  Payroll = 'Payroll',
  Pulse = 'Pulse',
  HRAdvisor = 'HR Advisor',
}
export enum EmployeeBulkImportStatusType {
  ValidatingData = 0,
  ImportingEmployeeData = 1,
  GeneratingPayslipData = 2,
  CalculatingPayslipData = 3,
  Completed = 4,
  Failed = 5,
  Cancelled = 6
}
export enum EntitlementLimitPolicyType {
  NoLimit = 0,
  FixedNumberOfDays = 3
}
export enum LeaveLimitType {
  NoLimit = 0,
  PercentageOfBalance = 1,
  PercentageOfEntitlement = 2,
  FixedNumberOfDays = 3
}
export enum RuleOverrideType {
  NotAllowed = 0,
  AdminAndLeaveAdmin = 1,
  ApproversAdminAndLeaveAdmin = 2
}
export enum PeriodStartDateType {
  StartDate = 0,
  CalendarYear = 1,
  CustomDate = 2
}
export enum AppMenuType {
  Dashboard = 'dashboard',
  People = 'people',
  TimeOff = 'time-off',
  CompanyProfile = 'company-profile',
  Expenses = 'expenses',
  Reports = 'reports',
  Payroll = 'payroll'
}
export enum EmployeeSelectStatusType {
  All = "All",
  Active = "Active",
  Inactive = "Inactive"
}