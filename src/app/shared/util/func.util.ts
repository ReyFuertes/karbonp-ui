import * as moment from 'moment';

export function CalculatePreviousBimester() {
  const today: Date = new Date();
  let fromDate: Date = today;
  let toDate: Date = today;
  const currentYear: number = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  let previousBiMonthlyPeriod = Math.round(currentMonth / 2) - 1;
  if (previousBiMonthlyPeriod == 0)
    previousBiMonthlyPeriod = 6;

  switch (previousBiMonthlyPeriod) {
    case 1:
      {
        fromDate = new Date(currentYear, 0, 1);
        toDate = new Date(currentYear, 1, 28, 23, 59, 59);
        break;
      }
    case 2:
      {
        fromDate = new Date(currentYear, 2, 1);
        toDate = new Date(currentYear, 3, 30, 23, 59, 59);
        break;
      }
    case 3:
      {
        fromDate = new Date(currentYear, 4, 1);
        toDate = new Date(currentYear, 5, 30, 23, 59, 59);
        break;
      }
    case 4:
      {
        fromDate = new Date(currentYear, 6, 1);
        toDate = new Date(currentYear, 7, 31, 23, 59, 59);
        break;
      }
    case 5:
      {
        fromDate = new Date(currentYear, 8, 1);
        toDate = new Date(currentYear, 9, 31, 23, 59, 59);
        break;
      }
    case 6:
      {
        fromDate = new Date(currentYear, 10, 1);
        toDate = new Date(currentYear, 11, 31, 23, 59, 59);
        break;
      }
    default:
      break;
  }
  if (toDate > today) {
    fromDate = moment(fromDate).subtract(1, 'years').toDate();
    toDate = moment(toDate).subtract(1, 'years').toDate();
  }
  return {
    fromDate: moment(fromDate).toDate(),
    toDate: moment(toDate).toDate()
  }
}


export function tokenGetter() {
  return localStorage.getItem("token");
}