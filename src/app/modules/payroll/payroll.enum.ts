
export enum BankingType {
  absaOnlineBanking = 'absaOnlineBanking',
  absaTelephoneBanking = 'absaTelephoneBanking',
  absaBankAtLocalBranch = 'absaBankAtLocalBranch',
  fnbOnlineBanking = 'fnbOnlineBanking',
  fnbTelephoneBanking = 'fnbTelephoneBanking',
  fnbBankAtLocalBranch = 'fnbBankAtLocalBranch',
  nedbankOnlineBanking = 'nedbankOnlineBanking',
  nedbankTelephoneBanking = 'nedbankTelephoneBanking',
  nedbankBankAtLocalBranch = 'nedbankBankAtLocalBranch',
  standardBankOnlineBanking = 'standardBankOnlineBanking',
  standardBankTelephoneBanking = 'standardBankTelephoneBanking',
  standardBankBankAtLocalBranch = 'standardBankBankAtLocalBranch'
}
export enum PaymentStatusType {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Cancelled = 3,
  AwaitingPayment = 4,
  AwaitingAuthorization = 5,
  Authorized = 6,
  Declined = 7
}
export enum CategoryOfWithholdingAgentType {
  Private = 'private',
  Government = 'government'
}
export enum SubmissionDocumentType {
  BIR1601C = 0,
  SSSR3 = 1,
  SSSR5 = 2,
  SSSLoan = 3,
  HDMF = 4,
  HDMFLoan = 5,
  PHIC = 6,
  BIR2316 = 7
}
export enum BenefitType {
  AccomodationBenefit = 0,
  BursariesScholarshipsBenefit = 1,
  MedicalCostsBenefit = 2,
  EmployeesDebtBenefit = 3,
  CompanyCarBenefit = 4,
  Custom = 5,
  CompanyCarUnderOperatingLeaseBenefit = 6,
  PensionFundBenefit = 7,
  ProvidentFundBenefit = 8,
  MedicalAidBenefit = 9,
  RetirementAnnuityFundBenefit = 10,
  ExemptBursariesScholarshipsBenefit = 11,
  BursariesScholarshipsBenefitDisabled = 12,
  ExemptBursariesScholarshipsBenefitDisabled = 13,
  SavingsFund = 14,
  LongServiceAward = 15
}
export enum UIFStatusType {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Failed = 3
}
export enum EMP201StatusType {
  Pending = 0,
  Completed = 1
}
export enum ContributionBase {
  Basic = 0,
  Gross = 1,
}
export enum PayrollCalculationDaysSettingType {
  ThirtyPointFourDays = 0,
  ThirtyDays = 1,
  FifteenPointTwoDays = 2,
  FifteenDays = 3,
  CalendarDays = 4,
}
export enum BasicSalaryIncomeType {
  BaseEarnings = 'BaseEarnings',
  HourlyRate = 'HourlyRate',
  DailyRate = 'DailyRate',
  DaysWorked = 'DaysWorked',
  NormalHours = 'NormalHours',
  OvertimeHours = 'OvertimeHours',
  AdditionalHours = 'AdditionalHours',
  SundayNormalOverrideHours = 'SundayNormalOverrideHours',
  SundayOvertimeOverrideHours = 'SundayOvertimeOverrideHours',
  ExchangeRate = 'ExchangeRate',
}
export enum ContributionCalculationType {
  FixedAmount = 0,
  PercentageOfRFI = 1
}
export enum LoanCalculationOptionType {
  Fixed = 0,
  PercentageOfSalary = 1,
  TimesUMAAmount = 2,
}
export enum BeneficiaryType {
  MaintenanceOrder = 1,
  Garnishee = 2,
  PensionFund = 3,
  MedicalAid = 4,
  ProvidentFund = 5,
  RetirementAnnuityFund = 6
}
export enum InputType {
  FixedAmount = 1,
  AmountPerEmployee = 2,
  DifferentOnEveryPayslip = 3,
  OnceOffForSpecifiedPayslips = 4,
  HourlyRateFactorHours = 5,
  CustomRateQuantity = 6,
  PercentageOfIncome = 7,
  Formula = 8,
  MonthlyForNonMonthlyEmployees = 9,
  PercentageOfGross = 10
}
export enum PayslipStatusType {
  ApprovedOnly = 1,
  DraftOnly = 2
}
export enum TimeTrackingType {
  XmartClock = 0
}
export enum CheckInStatusType {
  In = 0,
  Out = 1,
  Paused = 2
}
export enum CustomItemType {
  Income = 1,
  Deduction = 2,
  Allowance = 3,
  Benefit = 4,
  EmployerContribution = 5,
  Reimbursement = 6
}
export enum PayrollInputType {
  Allowance = 0,
  BasicSalary = 1,
  Benefit = 2,
  Deduction = 3,
  Income = 4,
  Other = 5
}
export enum TimeOffSystemType {
  AnnualLeave = 0,
  SickLeave = 1,
  FamilyResponsibilityLeave = 2,
  UnpaidLeave = 3,
  WorkAccidentLeave = 4,
  MaternityLeave = 5
}
export enum NightDifferentialPaymentOption {
  PercentageOfBasic = 0,
  Hours = 1
}
export enum SubsistenceReimbursementCostType {
  IncidentalCostsOnly = 0,
  MealsAndIncidentalCosts = 1
}
export enum MedicalCostsBeneficiaryType {
  EmployeeSpouseChild = 0,
  OtherRelativesOrDependants = 1
}
export enum BursariesScholarshipsType {
  School = 0,
  HigherEducation = 1
}
export enum BenefitCalculationType {
  Fixed = 0,
  Percentage = 1
}
export enum SeveranceType {
  Settlement = 1,
  Liquidation = 2,
  Voluntary = 3,
  InVoluntary = 4
}
export enum PaymentScheme {
  EveryPayPeriod = 0,
  LastPayPeriodOfMonth = 1,
  FirstPayPeriodOfMonth = 2,
}
export enum PayrollOtherType {
  EmployerLoan = 0,
  ForeignServiceIncome = 1,
  Savings = 2,
  TaxDirective = 3,
  TerminationLumpSum = 4,
  Custom = 5
}
export enum PayrollIncomeType {
  Commission = 0,
  LossOfIncomePolicyPayout = 1,
  Custom = 2,
  AnnualBonus = 3,
  AnnualPayment = 4,
  ArbitrationAward = 5,
  ExtraPay = 6,
  LeavePaidOut = 7,
  RestraintOfTrade = 8,
  LeaveSetup = 9,
  ChristmasBonus = 10,
  Severance = 11,
  Retirement = 12,
  RetroactiveSalary = 13,
  NightDifferential = 14,
  ProfitSharing = 15,
  ThirteenthMonthPay = 16,
  Absent = 17,
  Undertime = 18,
  Late = 19,
  OfficialBusiness = 20,
  NightDifferentialOvertime = 21,
  RestDay = 22,
  RestDayOT = 23,
  RestDayND = 24,
  RestDayNDOT = 25,
  SpecialHoliday = 26,
  SpecialHolidayOT = 27,
  SpecialHolidayND = 28,
  SpecialHolidayNDOT = 29,
  LegalHoliday = 30,
  LegalHolidayOT = 31,
  LegalHolidayND = 32,
  LegalHolidayNDOT = 33,
  SpecialHolidayRestDay = 34,
  SpecialHolidayRestDayOT = 35,
  SpecialHolidayRestDayND = 36,
  SpecialHolidayRestDayNDOT = 37,
  LegalHolidayRestDay = 38,
  LegalHolidayRestDayOT = 39,
  LegalHolidayRestDayND = 40,
  LegalHolidayRestDayNDOT = 41,
  DoubleHoliday = 42,
  DoubleHolidayOT = 43,
  DoubleHolidayND = 44,
  DoubleHolidayNDOT = 45,
  DoubleHolidayRestDay = 46,
  DoubleHolidayRestDayOT = 47,
  DoubleHolidayRestDayND = 48,
  DoubleHolidayRestDayNDOT = 49,
}
export enum LongServiceAwardType {
  Cash = 0,
  Voucher = 1
}
export enum PayrollBenefitType {
  Accomodation = 0,
  CompanyCar = 1,
  BursariesScholarships = 2,
  EmployeesDebtBenefit = 3,
  MedicalCosts = 4,
  Custom = 5,
  CompanyCarUnderOperatingLease = 6,
  SavingsFund = 7,
  LongServiceAward = 8
}
export enum PayrollDeductionType {
  Garnishee = 0,
  IncomeProtection = 1,
  MaintenanceOrder = 2,
  PensionFund = 3,
  ProvidentFund = 4,
  RetirementAnnuityFund = 5,
  UnionMembershipFee = 6,
  VoluntaryTaxOverDeduction = 7,
  Custom = 8,
  Donation = 9,
  RepaymentOfAdvance = 10,
  StaffPurchases = 11,
  MedicalAid = 12,
  Meals = 13,
  InfonavitLoan = 14,
  FONACOTLoan = 15,
  Housing = 16,
  VoluntaryHDMFContribution = 17,
  SSSLoan = 18,
  HDMFLoan = 19,
  AdvancedGovernmentDeduction = 20,
  CustomLoan = 21,
  SSSOverride = 22,
  HDMFOverride = 23,
  PHICOverride = 24,
  TaxOverride = 25
}
export enum PayrollAllowanceType {
  TravelAllowance = 0,
  Custom = 1,
  ComputerAllowance = 2,
  PhoneAllowance = 3,
  ExpenseClaim = 4,
  RelocationAllowance = 5,
  SubsistenceAllowanceInternational = 6,
  SubsistenceAllowanceLocal = 7,
  ToolAllowance = 8,
  UniformAllowance = 9,
  BroadBasedEmployeeSharePlan = 10,
  GainOnVestingOfEquityInstruments = 11,
  Attendance = 12,
  Gym = 13,
  PantryVouchers = 14,
  GasolineVouchers = 15,
  TransportSubsidy = 16,
  EducationalScholarships = 17,
  DiningSubsidy = 18,
  MealAllowance = 19,
  ServiceIncentiveLeavePaidOut = 20,
  RiceSubsidy = 21,
  MedicalCashAllowance = 22,
  UniformAndClothingAllowance = 23,
  LaundryAllowance = 24,
  MedicalBenefit = 25,
  Gifts = 26,
  AchievementAward = 27,
  CBABenefit = 28
}