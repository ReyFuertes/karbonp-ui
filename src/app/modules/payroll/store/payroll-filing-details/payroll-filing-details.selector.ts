import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollPayRunModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');

export const getTradeClassificationGroupsSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollFilingDetail?.tradeClassificationGroups || undefined)
export const getStandardIndustrialClassificationLevel1Selector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollFilingDetail?.standardIndustrialClassificationLevels || undefined)

