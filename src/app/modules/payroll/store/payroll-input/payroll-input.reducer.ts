import { Action, createReducer, on } from "@ngrx/store";

import { IPayrollCalculation, IPayrollCalculationSetting, IPayrollInput, IPhilippinesRegulatedSetting } from "../../payroll.model";
import { getBasicSalaryPayrollInputSuccessAction, getDeductionPayrollInputSuccessAction, getPayPointByEmployeeIdSuccessAction, getPayrollCalculationSetupSuccessAction, getRelevantPhilippinesRegulatedSettinguccessAction, getSelectedPayrollInputSuccessAction } from "./payroll-input.action";
import { IPaypoint } from "src/app/models/generic.model";

export interface PayrollPayrunInputState {
  isLoading: boolean;
  selectedDeductionPayrollInput: IPayrollInput;
  selectedPayrollInput: IPayrollInput;
  philippinesRegulatedSetting: IPhilippinesRegulatedSetting;
  payPoint: IPaypoint;
  payrollCalculationSettings: IPayrollCalculationSetting[],
  payrollcalculation: IPayrollCalculation;
  basicSalaryPayrollInput: IPayrollInput
}
export const initialState: PayrollPayrunInputState = {
  isLoading: false,
  selectedDeductionPayrollInput: undefined,
  selectedPayrollInput: undefined,
  philippinesRegulatedSetting: undefined,
  payPoint: undefined,
  payrollCalculationSettings: [],
  payrollcalculation: undefined,
  basicSalaryPayrollInput: undefined
}
const payrollPayrunInputReducer = createReducer(
  initialState,

  on(getBasicSalaryPayrollInputSuccessAction, (state, action) => {
    return Object.assign({}, state, { basicSalaryPayrollInput: action?.response?.payrollInput });
  }),
  on(getPayrollCalculationSetupSuccessAction, (state, action) => {
    return Object.assign({}, state, { payrollcalculation: action?.response?.data });
  }),
  on(getPayPointByEmployeeIdSuccessAction, (state, action) => {
    return Object.assign({}, state, { payPoint: action?.response?.data });
  }),
  on(getRelevantPhilippinesRegulatedSettinguccessAction, (state, action) => {
    return Object.assign({}, state, { philippinesRegulatedSetting: action?.response });
  }),
  on(getSelectedPayrollInputSuccessAction, (state, action) => {
    return Object.assign({}, state, { selectedPayrollInput: action?.response?.payrollInput });
  }),
  on(getDeductionPayrollInputSuccessAction, (state, action) => {
    return Object.assign({}, state, { selectedDeductionPayrollInput: action?.response?.payrollInput });
  }),
);
export function PayrollPayrunInputReducer(state: PayrollPayrunInputState, action: Action) {
  return payrollPayrunInputReducer(state, action);
}
