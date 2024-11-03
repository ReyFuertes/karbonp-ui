import { IAdditionalSettings, IAvailableExchangeRate, ILeaveSetup, IMultiSelectEmployee, IPaymentMethod, IPayPeriod, IPaypoint, IXeroTenant } from "src/app/models/generic.model";
import { IEmployee } from "../employee/employee.model";
import { BeneficiaryType, BenefitType, ContributionCalculationType, CustomItemType, NightDifferentialPaymentOption, PayrollAllowanceType, PayrollDeductionType, PayrollInputType, SeveranceType, SubsistenceReimbursementCostType, TimeTrackingType } from "./payroll.enum";
import { IPublicHoliday } from "../time-off/time-off.model";
import { PayFrequencyType } from "src/app/models/generic.enum";

export interface IBankingDetail {
  name?: string;
  icon?: string;
  accountHolder: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  toggles: string[];
}
export interface ISchedulePaymentSetupData {
  directPayment: IDirectPayment;
  payRunPaymentEmployees: IPayRunPaymentEmployee[];
  paymentAuthorizers: IPaymentAuthorizer[];
  paymentTransactionFee: IPaymentTransactionFee;
  publicHolidays: IPublicHoliday[];
}
export interface IPaymentTransactionFee {
  fee: number;
  fromDate: string;
  id: number;
  rtcFee: number;
}
export interface IPaymentAuthorizer {
  id: number;
  locationId: number;
  userEmail: string;
  userFullName: string;
  userId: number;
}
export interface IPayRunPaymentEmployee {
  bank: string;
  bankAccountNumber: string;
  branch: string;
  employeeId: number;
  employeeName: string;
  excluded: boolean;
  netPay: number;
  payEmployee: boolean;
  paymentMethod: string;
  payslipId: number;
}
export interface IDirectPayment {
  clientCode: string;
  companyId: number;
  companyOwnerIdDocumentId: number;
  companyRegistrationDocumentId: number;
  directPaymentStatus: number;
  id: number;
  paysoftEnabled: boolean;
  proofOfAddressDocumentId: number;
  signeeCapacity: string;
  signeeFullName: string;
  signeeIdNumber: string;
  signeeSignatureDocumentId: number;
  signeeSignedDate: string;
}
export interface IPaymentDetail {
  amount: number;
  authorizeDate?: string;
  authorizer: string;
  bank: string;
  declineReason: null
  employees: IEmployee[];
  id: number;
  nextReminderDate?: string;
  payPeriod: IPayPeriod;
  payRunDate: string;
  payRunId: number;
  payRunName?: string;
  paySoftAccountNumber: string;
  paymentMethod: string;
  paysoftAccountType: string;
  paysoftBranchCode: string;
  paysoftReference: string;
  reference: string;
  shouldArriveDate: string;
  status: number;
  transactionFeeTotal: number;
}
export interface IStandardIndustrialClassificationLevel {
  active?: boolean;
  id: number;
  name: string;
  parentId?: number;
  sicLevel?: number;
}
export interface IStandardIndustrialClassification {
  active: boolean;
  sicCode: string;
  sicCodeId: boolean;
  sicGroup: string;
  sicGroupId: boolean;
  sicLevel2: string;
  sicLevel2Id: boolean;
  sicLevel3: string;
  sicLevel3Id: boolean;
  sicLevel4: string;
  sicLevel4Id: boolean;
}
export interface ICoidaReport {
  benefitTypes: string[];
  fromDate: string;
  toDate: string;
  growthPercentage: number;
  incomeTypes: string[];
}
export interface IFillingSetup {
  companyId: number;
  diplomaticIndemnity: false
  id: number;
  payeNumber: string;
  sarsContactBusinessTelephoneNumber: string;
  sarsContactCellNumber: string;
  sarsContactEmail: string;
  sarsContactFaxNumber: string;
  sarsContactName: string;
  sarsContactPosition: string;
  sicCodeId: number;
  sicLevel2Id: number;
  sicLevel3Id: number;
  sicLevel4Id: number;
  sicMainGroupId: number;
  tradeClassificationGroupId: number;
  tradeClassificationId: number;
  uifNumber: string;
}
export interface IPhilippinesSubmittion1601C {
  addressCity: string;
  addressLine1: string;
  addressLine2?: string;
  addressPostalCode: string;
  addressStateProvince: string;
  bonusAndOtherBenefits: number;
  companyTradingName: string;
  contributionsEmployee: number;
  deMinimisBenefits: number;
  netTaxableCompensation: number;
  otherTaxExempt: number;
  revenueDistrictOffice: string;
  taxIdentificationNumber: string;
  totalCompensation: number;
  totalNonTaxableCompensation: number;
  totalTax: number;
  totalTaxableCompensation: number;
  underAnnualTaxIncome: number;
  addressCode: string;
  cashAmount?: number;
  cashBankAgency?: number;
  cashDate?: number;
  cashNumber?: number;
  category?: number;
  checkAmount?: number;
  checkBankAgency?: number;
  checkDate?: number;
  checkNumber?: number;
  companyName: string;
  compromise?: number;
  contactNumber?: number;
  dateOfExpiry?: number;
  dateOfIssue?: number;
  debitMemoAmount?: number;
  debitMemoDate?: number;
  debitMemoNumber?: number;
  email?: number;
  holidayOvertimeNightShiftHazardPay?: number;
  interest?: number;
  isAmended: false
  isTaxRelief?: number;
  isTaxWithheld: false
  otherAmount?: number;
  otherBankAgency?: number;
  otherDate?: number;
  otherNonTaxableCompensation?: number;
  otherNonTaxableCompensationSpecify?: number;
  otherNumber?: number;
  otherParticulars?: number;
  otherRemittancesMade?: number;
  otherRemittancesMadeSpecify?: number;
  previousMonthTaxesWithheldAdjustment?: number;
  rdoCode: string;
  statutoryMinimumWage?: number;
  submissionMonth: string;
  surcharge?: number;
  taxAgentAccreditationNumber?: number;
  taxReliefDetails?: number;
  taxRemittedInPreviousReturnFiled?: number;
  taxStillDue: number;
  taxableCompensationNotSubjectWithholdingTax: number;
  taxesWithheldForRemittance: number;
  thirteenthMonthPayOtherBenefits: number;
  tinNumber: string;
  totalAmountStillDue: number;
  totalPenalties?: number;
  totalTaxRemittancesMade?: number;
  totalTaxesWithheld: number;
}
export interface IPhilippinesSubmission {
  hasHDMFContributions: boolean;
  hasHDMFLoan: boolean;
  hasInProgressPayRuns: boolean;
  hasPHICContributions: boolean;
  hasSSSContributions: boolean;
  hasSSSLoan: boolean;
  month: string;
}
export interface IPayslipBenefit {
  payslipId?: number;
  benefitType: BenefitType;
  amount: number;
  customDescription: string;
  customItemId?: number;
  taxWitholdingAmount?: number;
  rate?: number;
  totalHours?: number;
}
export interface IIncomeAndBenefitTypes {
  benefitTypes: string[]; //note: no proper model
  incomesTypes: string[];
}
export interface IValidateIRP5IT3AError {
  control: string;
  error: string;
  isFilingDetailError: boolean;
}
export interface IValidateIRP5IT3ASubmission {
  employee: string;
  employeeId: number;
  errors?: IValidateIRP5IT3AError[];
  filingDetailId?: number;
}
export interface IIrp5Summission {
  employeeId: number;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  type: string;
  FromDate: string;
  toDate: string;
  isFinalised: boolean;
}
export interface ITaxSeason {
  fromDate: string;
  isMidTaxSeason: boolean;
  toDate: string;
}
export interface IMonthlyUifSubmission {
  uifSubmission: IUifSubmission;
  hasCompletedPayRuns: boolean;
  hasInProgressPayRuns: boolean;
}
export interface IUifSubmission {
  completedDate?: string;
  failureReason?: string;
  id: number;
  locationId: number;
  month: string;
  status: number;
  submissionDate?: string;
  submissionNumber: number;
}
export interface IMonthlyEmp201Submission {
  emP201Submission: IEmp201Submission;
  hasCompletedPayRuns: boolean;
  hasInProgressPayRuns: boolean;
}
export interface IEmp201Submission {
  completedDate?: string;
  emP201ETIAmounts: any[]; //note: no proper model
  etiCalculated: number;
  etiCarriedForward: number;
  etiCarriedOver: number;
  etiUsed: number;
  id: number;
  locationId: number;
  month: string;
  payeLiability: number;
  payePayable: number;
  payrollLiability: number;
  sdlLiability: number;
  sdlPayable: number;
  status: number;
  totalPayable: number;
  uifLiability: number;
  uifPayable: number;
}
export interface IBankType {
  id: number;
  name: string;
}
export interface IBankSetup {
  globalBranchCode?: string;
  id: number;
  name: string;
}
export interface IPayslipDisplaySetupItem {
  id: number;
  leaveSetup: ILeaveSetup[];
  payslipDisplaySetupId: number;
  showItemOnPayslip: boolean;
  timeOffSetupId: number;
}
export interface IPayslipSetup {
  additionalHeadings: string;
  doNotShowBenefits: boolean;
  doNotShowEmployerContributions: boolean;
  doNotShowLeave: boolean;
  doNotShowLeaveAdjustments: boolean;
  doNotShowTaxableIncomeDeductions: boolean;
  dontPrintCompanyNameHeading: boolean;
  formatForSelfSealingConfidentiaStationery: boolean;
  groupShiftUnderBaseEarnings: any; //note: no proper model
  hideDates: boolean;
  id: number;
  locationId: number;
  nameOfAdditionalNumber: string;
  payslipComment: string;
  payslipDisplaySetupItems: IPayslipDisplaySetupItem[];
  printEmployeeBankingDetails: boolean;
  printPayPoint: boolean;
  printResidentialAddress: boolean;
  showAdditionalNumber: boolean;
  showCumulativeYTD: boolean;
  showEmployeeNumber: boolean;
  showHourlyBreakdown: boolean;
  showHourlyRate: boolean;
  showHoursAndRate: boolean;
  showIncomeTaxNumber: boolean;
  showLeaveDaysToExpire: boolean;
  showPayTypeHoursAndRates: boolean;
  showSeveranceBreakdown: boolean;
  showTaxCodes: boolean;
  showYTDbalances: boolean;
  showYTDbalancesEvenWhenCurrentValueIs0: boolean;
}
export interface IPayPeriodDateRange {
  fromDate: string;
  toDate: string;
}
export interface IPayrunPayPeriodCalculateRange {
  active: boolean;
  firstPayrollPeriodEndDate: string;
  id: number;
  interimDayOfMonth?: any; //note: no proper model
  lastDayOfMonth?: any; //note: no proper model
  name?: string;
  payFrequencyType: string;
  payOnLastDayOfMonth: boolean;
  payrollCalculationDaysSetting?: any; //note: no proper model
  secondPayOnLastDayOfMonth: boolean;
  twiceMonthlyStartingOnSecondPayDate: boolean;
}
export interface IPayPeriodTypesPayload {
  active?: boolean;
  pageNumber: number;
  pagesize: number;
  sortAscending: boolean;
  sortBy: string;
  searchText?: string;
  payFrequencyType?: PayFrequencyType;
  customItemType?: CustomItemType;
}
export interface IDailyWeeklyBreakdownDetail {
  basicSalaryShiftHoursViewModels: IBasicSalaryShiftHour[];
  date: string;
  normalHours: number;
  overtimeHours: number;
  dailyBreakdownType: number;
}
export interface IPayrunTimeAttendance {
  id: number;
  companyId: number;
  enabled: boolean;
}
export interface ICalculatedGoalGetter {
  accucracyLevel: number;
  closestValue: number;
  hasInitialAccuracyIssue: boolean;
  isGoalReached: boolean;
  iterations: number;
  payslip: IPayslip;
  targetValue: number;
}
export interface IPayrunBulkUpdateOption {
  locationId: number;
  recalculatePayslipsToggleDefault: boolean;
  showRecalculatePayslipsToggle: boolean;
}
export interface IPayrollSetup {
  customPayTypes: ICustomItem[];
  defaultPayrollCalculation: IPayrollCalculationSetting;
  employees: IMultiSelectEmployee[];
  hasCurrenciesInPayRun: boolean;
  payPoints: IPaypoint[];
  payRun: IPayrun;
  payRunBulkImport: IPayrunBulkImport
  payrollAllowanceInputs: IAllowanceInput[];
  payrollBenefitInputs: IAllowanceInput[];
  payrollCalculation: IPayrollCalculation;
  payrollDeductionInputs: IAllowanceInput[];
  payrollIncomeInputs: IAllowanceInput[];
  payrollOtherInputs: IAllowanceInput[];
  publicHolidays: IPublicHoliday[];
  timeOffSetups: ILeaveSetup[]
}
export interface IPayrunBulkImport {
  documentId: number;
  errors: any[]; //note: no proper model
  id: number;
  importProgress: number;
  isProcessing: boolean
  items: any[]; //note: no proper model
  locationId: number;
  payRunId: number;
  recalculatePayslips: boolean;
  status: number;
  totalRecords: number;
  type: number;
}
export interface IPhilippinesRegulatedSetting {
  collectiveBargainingAgreementBenefitLimitPerYear: number;
  employeeAchievementAwardLimitPerYear: number;
  fromDate: string;
  giftBenefitsLimitPerYear: number;
  hdmfPremiumSettings: {
    employeeHigherSalaryContributionLimit: number;
    employeeHigherSalaryPercentage: number;
    employeeLowerSalaryContributionLimit: number;
    employeeLowerSalaryPercentage: number;
    employeeSalaryLimit: number;
    employerContributionLimit: number;
    employerContributionPercentage: number;
  }
  id: number;
  laundryAllowancePerMonth: number;
  mealAllowanceLimit: number;
  medicalBenefitsLimitPerYear: number;
  medicalCashAllowanceMonthlyLimit: number;
  nightDifferentialContributionPercentage: number;
  phicPremiumSettings: {
    higherLimit: number;
    higherLimitContribution: number;
    lowerLimit: number;
    lowerLimitContribution: number;
    percentageContribution: number;
  }
  riceSubsidyLimit: number;
  socialSecuritySystemSettings: {
    compensationEmployeeAmount: number;
    compensationEmployerAmount: number;
    employeeProvidentFundAmount: number;
    employerProvidentFundAmount: number;
    id: number;
    mandatoryProvidentFundCredit: number;
    regularEmployeeSocialSecurityContribution: number;
    regularEmployerSocialSecurityContribution: number;
    salaryRangeFrom: number;
    salaryRangeTo: number;
  }[],
  thirteenthMonthPayTaxExemptPortion: number;
  timeOffCreditsDayLimitPerYear: number;
  uniformAndClothingLimitPerYear: number;
}
export interface IIncomeInput extends IEmployeePayrunId {
  id?: number;
  payrollIncomeType: number;
  amount: number;
  nonTaxableAmount: number;
  directiveNumber: number;
  LeaveDaysPaidOut: number;
  IsExtraOrdinaryIncome: boolean;
  severanceType: SeveranceType;
  severanceIndemnityNinetyDays: boolean;
  severanceSeniorityPremium: boolean;
  severanceCompensationTwentyDaysPerYear: boolean;
  separationPay: boolean;
  payThirteenthMonthPay: boolean;
  settleLoanBalance: boolean;
  calculateTaxAndIncludeInRefund: boolean;
  recurringIncome: boolean;
  SeveranceLeaveDaysPaidOutOverride: number;
  SeveranceUsePartialYearsForServiceLength: boolean;
  severanceChristmasBonusOverride: number;
  severanceApplyVacationPremiumToFullLeaveAmount: boolean;
  nightDifferentialOption?: NightDifferentialPaymentOption;
  MaternityGrossPayOverride?: number;
  severanceSeniorityPremiumOverride?: number;
  severanceIndemnityNinetyDaysOverride?: number;
  severanceCompensationTwentyDaysPerYearOverride?: number;
  leaveDaysPaidOut?: boolean;
  customRate: number;
  isExtraOrdinaryIncome: boolean;
  severanceUsePartialYearsForServiceLength: boolean;
  severanceLeaveDaysPaidOutOverride: boolean;
  maternityGrossPayOverride: boolean;
}
export interface IDeductionInput extends IEmployeePayrunId {
  amount: number;
  amountOverride?: number;
  balance: number;
  beneficiaryId?: number;
  categoryFactor: number;
  contributionType: number;
  customItemId?: number;
  customRate?: number;
  deductionInputType: number;
  employeeAmountNotDeducted?: number;
  employeeHandlesPayment: boolean;
  employeeId: number;
  employerAmount: number;
  employerOwnsPolicy: boolean;
  id: number;
  loanCalculationOption?: number;
  loanId?: number;
  members: number;
  payRunId: number;
  quantity: number;
  recurringDeduction: boolean;
}
export interface IOtherInput extends IEmployeePayrunId {
  amount: number;
  applyTaxDirective: boolean;
  balanceIncrease?: number;
  balanceIncreaseAtBeginningOfPeriod: boolean;
  calculateInterestBenefit: boolean;
  cashEFTRepayment: boolean;
  customItemId?: number;
  customRate?: number;
  directiveIncomeAmount?: number;
  directiveIncomeSourceCode?: number;
  directiveIssueDate?: number;
  directiveNumber?: number;
  dontPayOutBalanceIncrease: boolean;
  employeeId: number;
  foreignServiceTaxExemptionApplied: boolean;
  id: number;
  interestRate?: number;
  onceOffDeduction?: number;
  otherInputType: number;
  payRunId: number;
  payoutDate?: string;
  savingsPaidOutToThirdParty: boolean;
  savingsPayOutAmount?: number;
  savingsPayOutOnCurrentPayslip: boolean;
  taxDirectiveType?: number;
  onceOffRepayment?: any; //note: no proper model
  payrollOtherType?: number;
}
export interface IEmployeePayrunId {
  employeeId?: number;
  payRunId?: number;
}
export interface IBenefitInput extends IEmployeePayrunId {
  amount: number;
  benefitCalculationType?: number;
  benefitTaxablePercentage?: number;
  bursariesScholarshipsType?: number;
  companyCarIncludesMaintenancePlan: boolean;
  customItem?: ICustomItem;
  customRate?: number;
  disabledPerson: boolean;
  exemptPortion?: any; //note: no proper model
  id: number;
  isOnceOffType: boolean;
  leaveSetup: ILeaveSetup;
  longServiceAwardType: any; //note: no proper model
  medicalCostsBeneficiaryType?: any; //note: no proper model
  payrollBenefitType: number;
  payrollInputType: number;
  payslip: IPayslip;
  payslipId: number;
  timeOffBookingId?: number;
}
export interface IAllowanceInput extends IEmployeePayrunId {
  id?: number;
  payrollAllowanceType: PayrollAllowanceType
  Amount: number;
  recurringAllowance: boolean;
  travelAllowanceFixedAmount: boolean;
  travelAllowanceReimbursedForExpenses: boolean;
  travelAllowanceHasCompanyFuelCard: boolean;
  travelAllowanceReimbursedForDistanceTravelled: boolean;
  travelAllowanceRatePerDistanceUnit: number;
  travelAllowanceOnly20PercentTaxable?: boolean;
  travelAllowanceExpenses?: number;
  travelAllowanceFuelCardSpend?: number;
  travelAllowanceDistanceTravelled?: number;
  nonTaxableAmount?: number;
  employerAmount?: number;
  subsistenceReimbursementCostType?: SubsistenceReimbursementCostType;
  maximumDailySubsistenceAmount: number;
  numberOfDays: number;
  taxDeduction?: number;
  directiveNumber: string;
  isSocialWelfareBenefit: boolean;
  addAccompanyingDeduction: boolean;
  isPercentageValue: boolean;
  adjustmentAmount?: number;
  amount?: number;
  customRate?: number;
  fixedAmountPaidRegularly?: number;
  fuelCardAmount?: number;
  kmsTravelled?: any; //note: no proper model
}
export interface IPayrollInputNote extends IEmployeePayrunId {
  id?: number;
  copyNoteOver: boolean;
  isPrivateNote?: boolean;
  notes: string;
}
export interface IBasicSalaryShiftHour {
  basicSalaryDailyBreakdownHoursId?: number;
  id?: number;
  normalHours: number;
  overtimeHours: number;
  shiftId: number;
}
export interface IDailyBreakDownHour {
  attendanceId: number;
  basicSalaryDailyBreakdownType: number;
  basicSalaryShiftHours: IBasicSalaryShiftHour[];
  date: string;
  id: number;
  normalHours: number;
  overtimeHours: number;
  overtimeRequestId?: number;
  publicHolidayId?: number;
}
export interface IPayrollInput {
  additionalHours?: number;
  calculateDailyBreakdownForFixedPay?: boolean;
  customItem?: any;
  customRate?: number;
  dailyBreakdownHours?: IDailyBreakDownHour[];
  dailyRate?: number;
  daysWorked?: number;
  dontAutoPayPublicHolidays?: boolean;
  fixedAmount?: number;
  hourlyRate?: number
  id?: number
  isOnceOffType?: boolean;
  leaveSetup?: ILeaveSetup;
  normalHours?: number;
  overrideCalculatedHourlyRate?: boolean;
  overrideFixedPay?: boolean;
  overtimeHoursOverrideIndicator?: boolean;
  overtimeOverrideHours?: number;
  paidForAdditionalHours?: boolean;
  paymentType?: number
  payrollInputType?: number
  payslipId?: number
  rateOverride?: number;
  shortHours?: number
  sundayNormalHoursOverrideIndicator?: boolean;
  sundayNormalOverrideHours?: number;
  sundayOvertimeHoursOverrideIndicator?: boolean;
  sundayOvertimeOverrideHours?: number;
  timeOffBookingId?: number;
  payrollOtherType?: PayrollInputType;
  closingBalance?: number;
  payrollIncomeType?: PayrollInputType;
  payrollDeductionType?: PayrollDeductionType;
  payrollBenefitType?: number; //note: what type?
  //note: refactor this
  inputGroupType?: number;
  payrollAllowanceType?: number;
  inputType?: number;
  resource?: string;
  customItemId?: number;
  leaveSetupId?: number;
  amount?: number;
  balanceIncrease?: number;
  amountOverride?: number;
  loanId?: number;
  loanCalculationOption?: any; //note: no propery model
  employerAmount?: number;
  employeeHandlesPayment?: any; //note: no propery model
  contributionCalculationType?: ContributionCalculationType;
  beneficiary?: IBeneficiary;
  nonDeductedAmount?: number;
  employerOwnsPolicy?: any; // note: no proper model
  categoryFactor?: any; // note: no proper model
  members?: any; // note: no proper model
  quantity?: number;
  recurringDeduction?: number;
}
export interface IBeneficiary {
  id: number;
  Type: BeneficiaryType;
  name: string;
  bankId: number;
  accountNumber: string;
  branchCode: string;
  accountTypeId: number;
  locationId: number;
  active: boolean;
}
export interface IBeneficiaryPayload {
  beneficiaryType: BeneficiaryType,
  active: boolean,
  implementSortingAndPaging: boolean
}

export interface IPayrollCalculationSetting {
  doubleHolidayNormalMultiplier: number;
  doubleHolidayOvertimeMultiplier: number;
  doubleHolidayRestDayNormalMultiplier: number;
  doubleHolidayRestDayOvertimeMultiplier: number;
  id: number;
  limitExceededOvertimeMultiplier: number;
  maximumSavingsFundRate: number;
  normalOvertimeMultiplier: number;
  publicHolidayNormalMultiplier: number;
  publicHolidayOvertimeHoursLimit: number;
  publicHolidayOvertimeLimitExceededRate: number;
  publicHolidayOvertimeMultiplier: number;
  publicHolidaySundayLimitExceededOvertimeRate: number;
  publicHolidaySundayNormalRate: number;
  publicHolidaySundayOvertimeHoursLimit: number;
  publicHolidaySundayOvertimeRate: number;
  specialHolidayNormalMultiplier: number;
  specialHolidayOvertimeHoursLimit: number;
  specialHolidayOvertimeLimitExceededRate: number;
  specialHolidayOvertimeMultiplier: number;
  specialHolidaySundayLimitExceededOvertimeRate: number;
  specialHolidaySundayNormalRate: number;
  specialHolidaySundayOvertimeHoursLimit: number;
  specialHolidaySundayOvertimeRate: number;
  sundayLimitExceededOvertimeRate: number;
  sundayNormalMultiplier: number;
  sundayOvertimeHoursLimit: number;
  sundayOvertimeMultiplier: number;
}
export interface IPayslipPreview {
  hasPastDraftPayslips: boolean;
  payslip: IPayslip;
}
export interface IDeduction {
  amount: number;
  customDescription?: string;
  customItemId?: number;
  deductionType: PayrollDeductionType;
  employerAmount: number;
  id: number;
  isSocialSecurityDeduction: boolean;
  loanId?: number;
  payslipId: number;
  rate?: number;
  totalHours?: number;
}
export interface IEmployeerContribution {
  amount: number;
  customDescription?: string;
  customItemId?: number;
  employerContributionType: number;
  id: number;
  isSocialSecurityDeduction: boolean;
  payslipId: number;
}
export interface IIncome {
  adjustmentAmount?: number;
  amount: number;
  customDescription?: number;
  customItemId?: number;
  id: number;
  incomeGroupType: number;
  incomeType: number;
  isSeveranceIncome: boolean;
  leaveSetupId?: number;
  payslipId: number;
  payslipIncomeTaxType: number;
  rate?: number;
  shiftId?: number;
  taxBenefitAmount?: number;
  taxWitholdingAmount?: number;
  taxable: boolean;
  totalDays?: number;
  totalHours?: number;
}
export interface IPayslip {
  additionalMedicalAidTaxCredit?: number;
  annualisedRegularIncome: number;
  annualisedTotalIncome: number;
  benefits: any; //note: not a standard object structure
  copyNotes: boolean;
  copyPrivateNotes: boolean;
  costToCompany: number;
  deductions: IDeduction[];
  donationTaxDeduction: number;
  employeeId: number;
  employerContributions: IEmployeerContribution[];
  grossAmount: number;
  id: number;
  incomes: IIncome[];
  isOnceOffPayslip: boolean;
  lastEmailSentDate?: string;
  lastEmailSentEmailAddress?: string;
  medicalAidMembers: number;
  medicalAidTaxCredit?: number;
  mexicoPayslipBreakdown?: any; //note: no proper model
  nettAmount: number;
  notes?: string;
  overrideProRataPercentage: boolean;
  payRunId: number;
  payrollInputs: IPayrollInput[];
  payslipCurrency?: any;
  payslipEmailStatus: number;
  payslipEmailStatusMessag?: string;
  payslipStatus: number;
  philippinesPayslipBreakdown?: any; //note: no proper model
  privateNotes?: string;
  proRataOverridePercentage?: number;
  proRataPercentage?: number;
  requiresRecalculation: boolean;
  retirementContribution: number;
  retirementDeduction: number;
  southAfricaPayslipBreakdown: {
    dailyWage: number;
    hourlyRate: number;
    id: number;
    payslipId: number;
  }
  taxAlreadyPaid: number;
  taxForCurrentPayslip: number;
  taxOnIrregularIncome: number;
  taxOnRegularIncome: number;
  totalIrregularIncome: number;
  totalPeriods: number;
  totalRegularIncome: number;
  totalTaxOnIncome: number;
  totalUIFIncome: number;
  yearToDateIrregularIncome: number;
  yearToDateMedicalTaxCredits: number;
  yearToDatePeriods: number;
  yearToDateRegularIncome: number;
  yearToDateTax: number;
  yearToDateTotalIncome: number;
  tempNotes?: string;
}
export interface IPayrollEmployeeSetupData {
  allEmployeePayRuns: IPayrun[];
  customPayTypes: ICustomPaytype[];
  designationExchangeRate: number
  employee: IEmployee;
  employeeExcludedFromTax: boolean;
  exchangeRates: IAvailableExchangeRate[];
  excludeFromGovernmentContributions: boolean;
  hasLastDayOfService: boolean;
  hasPausedLoans: boolean;
  outstandingEmployerLoanClosingBalance?: number;
  payPeriod: IPayPeriod;
  payRun: IPayrun;
  paymentMethod: IPaymentMethod
  payrollAllowanceInputs: IPayrollAllowanceInput[];
  payrollBenefitInputs: IPayrollAllowanceInput[];
  payrollCalculation: IPayrollCalculation;
  payrollDeductionInputs: IPayrollAllowanceInput[];
  payrollIncomeInputs: IPayrollAllowanceInput[];
  payrollOtherInputs: IPayrollAllowanceInput[];
  payslipLoans: ILoan[];
  timeOffSetups: ILeaveSetup[];
  payFrequencyType: ILeaveSetup;
}
export interface ICustomItem {
  locationId: number;
  type: CustomItemType;
  name: string;
  amount: number;
  inputType: number;
  active: boolean;
  includeInSBCCalculation: boolean;
  leaveSetups: ILeaveSetup[];
}
export interface ILoan {
  employee: IEmployee;
  payRun: IPayrun;
  customPayTypes: ICustomItem[];
  timeOffSetups: ILeaveSetup[];
  allEmployeePayRuns: IPayrun[];
  payPeriod: IPayPeriod;
  paymentMethod: IPaymentMethod;
  payrollCalculation: IPayrollCalculation;
  payrollIncomeInputs: IPayrollAllowanceInput[];
  payrollAllowanceInputs: IPayrollAllowanceInput[];
  payrollDeductionInputs: IPayrollAllowanceInput[];
  payrollBenefitInputs: IPayrollAllowanceInput[];
  payrollOtherInputs: IPayrollAllowanceInput[];
  exchangeRates: IAvailableExchangeRate;
  designationExchangeRate?: number;
  hasLastDayOfService: boolean;
  outstandingEmployerLoanClosingBalance?: number;
  payslipLoans: any[];
  hasPausedLoans: boolean;
  employeeExcludedFromTax: boolean;
  excludeFromGovernmentContributions: boolean;
}
export interface IDoubleHolidayPay {
  normalMultiplier: number;
  overtimeMultiplier: number;
  restDayNormalMultiplier: number;
  restDayOvertimeMultiplier: number;
}
export interface IOvertimeLimit {
  consecutiveDayLimit: number;
  dailyLimit: number;
  limitExceededOvertimeMultiplier?: number;
  limitType: number;
  normalOvertimeMultiplier?: number;
  weeklyLimit?: number;
}
export interface IHolidayPay {
  normalMultiplier: number;
  normallyOffFixedComponent: number;
  normallyOffMinimumPay: number;
  normallyWorksFixedComponent: number;
  normallyWorksMinimumPay: number;
  overrideHolidayPayRates: true
  overtimeHoursLimit?: number;
  overtimeLimitExceededRate?: number;
  overtimeMultiplier: number;
  sundayNormalRate: number;
  sundayOvertimeHoursLimit?: number;
  sundayOvertimeLimitExceededRate?: number;
  sundayOvertimeRate: number;
}
export interface ISundayPay {
  minimumPay: number;
  normallyOffMultiplier?: number;
  normallyWorksMultiplier: number;
  overrideSundayPayRates: boolean;
  overtimeHoursLimit?: number;
  overtimeLimitExceededRate?: number;
  overtimeMultiplier: number;
  separateInputForOvertimeHoursPaid2X: boolean;
}
export interface IPayrollCalculation {
  additionalSettings: IAdditionalSettings
  bceaLeavePayEffectiveFromDate?: string;
  bceaLeavePayEnableFluctuatingRate: boolean;
  dontAutoPayPublicHolidays: boolean;
  doubleHolidayPay: IDoubleHolidayPay;
  enableGoalGetter: boolean;
  enableInputOfNumberOfShifts: boolean;
  etiCompliant: boolean;
  etiEffectiveFromDate?: string;
  etiMinimumWageMonthly?: string;
  etiMinimumWageNormalRate?: number;
  etiSpecialEconomicZone?: string;
  garnisheeDoNotDeductCommission: boolean;
  hourlyRate?: number;
  id: number;
  locationId: number;
  overtimeLimit: IOvertimeLimit;
  proRataMethod: number;
  proRataMethodEffectiveFromDate?: string;
  publicHolidayPay: IHolidayPay;
  sdlEffectiveFromDate?: string;
  specialHolidayPay: IHolidayPay;
  sundayPay: ISundayPay;
  christmasBonusDaysPaid?: number;
  consecutiveDayLimit?: number;
  dailyLimit?: number;
  dailyUMAValueOverride?: number;
  doubleHolidayPayNormalMultiplier?: number;
  doubleHolidayPayOvertimeMultiplier?: number;
  doubleHolidayPayRestDayNormalMultiplier?: number;
  doubleHolidayPayRestDayOvertimeMultiplier?: number;
  etiHasSpecialEconomicZone: boolean;
  holidayNormalMultiplier?: number;
  holidayOvertimeHoursLimit?: number;
  holidayOvertimeLimitExceededRate?: number;
  holidayOvertimeMultiplier?: number;
  holidaySundayLimitExceededOvertimeRate?: number;
  holidaySundayNormalRate?: number;
  holidaySundayOvertimeHoursLimit?: number;
  holidaySundayOvertimeRate?: number;
  limitExceededOvertimeMultiplier?: number;
  limitType: number;
  maximumSavingsFundRate?: number;
  nightDifferentialContributionPercentage?: number;
  normalOvertimeMultiplier?: number;
  normallyOffFixedComponent: number;
  normallyOffMinimumPay: number;
  normallyOffOnSpecialHolidayFixedComponent: number;
  normallyOffOnSpecialHolidayMinimumPay: number;
  normallyWorksFixedComponent: number;
  normallyWorksMinimumPay: number;
  normallyWorksOnSpecialHolidayFixedComponent: number;
  normallyWorksOnSpecialHolidayMinimumPay: number;
  overrideHolidayPayRates: boolean;
  overrideSpecialHolidayPayRates: boolean;
  overrideSundayPayRates: boolean;
  sbcCalculationType: number;
  sbcPantryVoucherCalculationType: number;
  specialHolidayOvertimeHoursLimit?: number;
  specialHolidayOvertimeLimitExceededRate?: number;
  specialHolidaySundayLimitExceededOvertimeRate?: number;
  specialHolidaySundayNormalRate?: number;
  specialHolidaySundayOvertimeHoursLimit?: number;
  specialHolidaySundayOvertimeRate?: number;
  specialholidayNormalMultiplier?: number;
  specialholidayOvertimeMultiplier?: number;
  sundayOvertimeHoursLimit?: number;
  sundayOvertimeLimitExceededRate?: number;
  sundayOvertimeRate?: number;
  sundayPayMinimumPay: number;
  sundayPayNormallyOffMultiplier?: number;
  sundayPayNormallyWorksMultiplier?: number;
  sundayPaySeparateInputForOvertimeHoursPaid2X: true
  taxMethod: number;
  weeklyLimit?: number;
}
export interface IPayrollAllowanceInput {
  inputGroupType?: number;
  inputType: number;
  resource: string;
  customItemId?: number;
  leaveSetupId?: number;
}
export interface ICustomPaytype {
  active: boolean;
  addToBaseYTDTotal: boolean;
  affectsWageForETIPurposes: boolean;
  amount?: number;
  customRate: number
  differentRateForEachEmployee: boolean;
  hoursWorkedFactor?: number;
  id: number;
  includeInFluctuatingLeaveRate: boolean;
  includeInSBCCalculation: boolean;
  inputType: number;
  leaveSetups: ILeaveSetup[];
  overrideTaxablePercentageOption?: number; //note: why is no type?
  taxExemptOptionAmount?: number;
  taxedAnnually: boolean;
  annualLeavePayExtra: true
  basicHourlyPay: true
  basicSalary: true
  deductFromTaxableIncome: boolean;
  formula?: number;
  locationId: number;
  name: string
  overtime: boolean;
  percentage: number;
  publicHolidayNotWorked: boolean;
  publicHolidayWorked: boolean;
  rateFactor?: number;
  shortTime: boolean;
  sunday: boolean;
  sundayOvertime: boolean;
  type: number;
  customItemType?: number; //note: this field/property doesnt exist in the response -_-
}
export interface IDownloadBulkPayslipPayload {
  documentType: number;
  employeeIds?: number[];
  includeEMP201: boolean;
  language: string;
  mergePdf: boolean;
  payPointIds?: number[];
  payRunId: number;
}
export interface IPayrun {
  fromDate: string;
  id: number;
  isCustomPayRun: boolean;
  isProcessing: boolean;
  isReleasedToSelfService: boolean;
  locationId: number;
  name: string;
  payDate?: string;
  payFrequencyId?: number;
  rules: any;
  status: number;
  toDate: string;
  xeroInvoiceCreatedByUserId?: number;
  xeroInvoiceId?: number;
}
export interface ICustomPayrunPayload {
  date: string;
  employeeIds: number[];
  name: string;
}
export interface IApprovePayslipPayload {
  payslipId: number;
  revert: boolean;
}
export interface IPayRunEmployeePayload {
  employeeIds?: number[],
  payRunId: number,
  payslipStatus?: any,
  sortAscending?: boolean,
  sortBy?: string;
}
export interface IPayrunEmployee {
  deductionAmount?: number
  email?: string;
  employeeId: number
  firstName: string;
  grossAmount: number
  hasPastDraftPayslip: boolean;
  lastEmailSentDate?: string;
  lastEmailSentEmailAddress?: string;
  lastName: string;
  middleName?: string;
  netAmount: number
  number: string;
  payRunId: number
  paySlipStatus: number
  paymentMethod: string;
  payslipEmailStatus: number
  payslipEmailStatusMessage?: string;
  payslipId: number;
  requiresRecalculation: boolean;
  taxAmount: number;
  emailSendType?: string;
}
export interface ISelectedPayrun {
  directPaymentEnabled: boolean,
  hasPastPayslips: boolean,
  hasPendingPayslips: boolean,
  liveSATSubmissionEnabled: boolean,
  payRun: IPayrunInProgress
  paymentId?: number
}
export interface ITimeTrackingIntegration {
  locationId: number;
  timeTrackingType: TimeTrackingType;
  accessToken: string;
}
export interface IEtfSetup {
  accountNumber: string;
  accountTypeId: number;
  active: boolean;
  bankId: number;
  branchCode: string;
  id: number;
  locationId: number;
  rules: { BranchCode: any, AccountNumber: any }; //note: need proper model
  AccountNumber: any[];//note: need proper model
  BranchCode: any[];//note: need proper model
  type: number;
}
export interface IPayrunCompleted {
  all: number;
  directPaymentsEnabled: boolean;
  endDate: string;
  id: number;
  isReleasedToSelfService: boolean;
  name?: string;
  payFrequency?: IPayPeriod[];
  payRunPaymentId?: number;
  paymentMethods: { count: number, name: string }[];
  total: number;
  xeroInvoiceId?: number;
  xeroTenant: IXeroTenant[];
  xeroUrl: string;
}
export interface IPayrunInProgress {
  directPaymentsEnabled: boolean;
  fromDate: string
  hasBulkImportInProgress: boolean;
  hasMissingCFDIIntregration: boolean;
  hasPastInProgressPayRuns: boolean;
  hasPayslipsNeedingRecalculation: boolean;
  id: number;
  isCustomPayRun: boolean;
  isProcessing: boolean;
  liveSATSubmissionEnabled: boolean;
  name?: string;
  payDate?: string;
  payFrequency?: number;
  payRunPaymentId?: number;
  processProgress: number;
  status: number;
  toDate: string;
  totalPayslips: number;
  totalPendingPayslips: number;
  emailSendType?: string;
}
export interface IGrossSalaryByMonthlyFinancialYear {
  date: string;
  employeePercentage: number;
  employees: number;
  grossAmount: number;
  grossPercentage: number;
  netAmount: number;
  netPercentage: number;
  order: number;
  taxAmount: number;
  taxPercentage: number;
}
export interface IGetPayRunsPerMonthOverview {
  fromDate?: string;
  toDate?: string;
  grossPay?: number;
  netPay?: number;
  numberOfEmployees?: number;
  numberOfPayRuns?: number;
  payPointsBreakdown?: { payPoint: string, grossPay: number, netPay: number }[];
  tax?: number;
}