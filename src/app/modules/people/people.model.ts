import { IDesignation, IOrganizationalUnit, IPayPeriod, IPaymentMethod, IPaypoint } from "src/app/models/generic.model";
import { IEmployee } from "../employee/employee.model";

export interface IPeopleStatus {
  id: number,
  name: string;
  description?: string;
}
export enum SBCCalculationType {
  Default = 0,
  BimesterSBCVariable = 1,
}
export enum SBCPantryVoucherCalculationType {
  IncludedInIntegrationFactor = 0,
  DailyAmountAddedToSBC = 1
}
export enum TaxMethod {
  PerPayPeriod = 0,
  Annualized = 1
}
export interface IPeopleEmployee {
  employee: IEmployee;
  payPeriods: IPayPeriod[];
  paymentMethods: IPaymentMethod[];
  payPoints: IPaypoint[];
  organizationalUnits: IOrganizationalUnit[];
  designation: IDesignation;
}
export enum IdentificationType {
  None = 0,
  NationalIdentificationNumber = 1,
  PassportForeignId = 2,
  AsylumSeekerPermit = 3,
  RefugeeId = 4
}
export enum EmploymentType {
  FullTime = 1,
  LessThan22HoursPerWeek = 2,
  Contractual = 3,
  Probationary = 4,
  Regular = 5,
  WorkContractForAnIndefinitePeriod = 6,
  WorkContractForSpecificWork = 7,
  FixedTermEmploymentContract = 8,
  SeasonalWorkContract = 9,
  LaborContractSubjectToProof = 10,
  EmploymentContractWithInitialTraining = 11,
  ContractingMethodForPaymentOfHoursWorked = 12,
  WorkModalityByLaborCommission = 13,
  ContractingModalitiesWhereThereIsNoEmploymentRelationship = 14,
  RetirementPension = 15,
  OtherContract = 17
}
export interface IRules {
  email: any[];
  number: any[]
}
export interface IResidentialAddress {
  city: string;
  country: number;
  line1: string;
  line2: string;
  postalCode: string;
  stateProvince: string;
  stateProvinceCode?: number;
}
export interface IPostalAddress {
  city: string;
  country: 0
  line1: string;
  line2: string;
  postalCode: string;
  stateProvince: string;
  stateProvinceCode?: string;
  postalSameAsResidential: boolean;
}
export interface IPeopleEmployeesResponse {
  employees: IEmployee[];
  totalCount: number;
}
export interface IEmployeePaginationPayload {
  active?: boolean;
  selfServiceEnabled?: boolean;
  sortBy: string;
  searchText?: string;
  sortAscending: boolean;
  pageNumber: number;
  pagesize: number;
}