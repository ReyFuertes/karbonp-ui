import { IOptionItem } from "src/app/models/generic.model";

// export const ItemsPayrunStatus: IOptionItem[] = [{
//   value: 'InProgress',
//   label: 'InProgress'
// }, {
//   value: 'Completed',
//   label: 'Completed'
// }];
export const PayrunStatus: IOptionItem[] = [{
  value: 'InProgress',
  label: 'InProgress'
}, {
  value: 'Completed',
  label: 'Completed'
}];
export const CustomDefaultPeriods: IOptionItem[] = [{
  value: 1,
  label: 'Custom'
}, {
  value: 7,
  label: 'LastWeek'
}, {
  value: 14,
  label: 'LastTwoWeeks'
}, {
  value: 0,
  label: 'CurrentMonth'
}, {
  value: 30,
  label: 'LastMonth'
}, {
  value: 90,
  label: 'LastThreeMonths'
}, {
  value: 365,
  label: 'CurrentTaxYear'
}, {
  value: 366,
  label: 'PreviousTaxYear'
}]