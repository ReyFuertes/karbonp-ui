import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DateSuffixPipe } from './date-suffix.pipe';
import { IPayPeriod } from 'src/app/models/generic.model';

@Pipe({
  name: 'payPeriodDescription',
  pure: false
})
export class PayPeriodDescriptionPipe implements PipeTransform {
  constructor(private translateService: TranslateService, private dateSuffixPipe: DateSuffixPipe) {
  }

  public transform(payPeriod: IPayPeriod, overrideName?: string): string {
    if (overrideName !== null && overrideName !== '')
      return overrideName;
    if (payPeriod === null)
      return this.translateService.instant('Custom');
    if (payPeriod?.name !== null && payPeriod?.name?.length > 0)
      return payPeriod?.name;
    if (payPeriod?.payFrequencyType === 1) {
      if (payPeriod?.payOnLastDayOfMonth)
        return this.translateService.instant('Monthly') + ', ' + this.translateService.instant('EndingOnTheLastDay');
      return this.translateService.instant('Monthly') + ' ' + this.translateService.instant('EndingOnThe') + ' ' + payPeriod?.lastDayOfMonth + this.dateSuffixPipe.transform(payPeriod?.lastDayOfMonth);
    }
    let day: string = 'Sunday';
    if (payPeriod?.firstPayrollPeriodEndDate !== null && payPeriod?.firstPayrollPeriodEndDate !== '') {
      switch (new Date(payPeriod?.firstPayrollPeriodEndDate).getDay()) {
        case 0:
          day = 'Sunday';
          break;
        case 1:
          day = 'Monday';
          break;
        case 2:
          day = 'Tuesday';
          break;
        case 3:
          day = 'Wednesday';
          break;
        case 4:
          day = 'Thursday';
          break;
        case 5:
          day = 'Friday';
          break;
        case 6:
          day = 'Saturday';
      }
    }
    if (payPeriod?.payFrequencyType === 2)
      return this.translateService.instant('Weekly') + ' '
        + this.translateService.instant('EndingOn') + ' '
        + this.translateService.instant(day);
    if (payPeriod?.payFrequencyType === 3)
      return this.translateService.instant('EveryTwoWeeks') + ' '
        + this.translateService.instant('EndingOn') + ' '
        + this.translateService.instant(day);
    if (payPeriod?.payFrequencyType === 4) {
      if (payPeriod?.secondPayOnLastDayOfMonth) {
        return this.translateService.instant('TwiceMonthly') + ' '
          + this.translateService.instant('EndingOnTheLastDay') + ' '
          + this.translateService.instant('And') + ' '
          + this.translateService.instant('InterimDayOfMonth') + ' '
          + this.translateService.instant('The') + ' '
          + payPeriod?.interimDayOfMonth + this.dateSuffixPipe.transform(payPeriod?.interimDayOfMonth.toString());
      }
      return this.translateService.instant('TwiceMonthly') + ' '
        + this.translateService.instant('EndingOnThe') + ' '
        + payPeriod?.lastDayOfMonth
        + this.dateSuffixPipe.transform(payPeriod?.lastDayOfMonth) + ' '
        + this.translateService.instant('And') + ' '
        + this.translateService.instant('InterimDayOfMonth') + ' '
        + this.translateService.instant('The') + ' '
        + payPeriod?.interimDayOfMonth + this.dateSuffixPipe.transform(payPeriod?.interimDayOfMonth?.toString());
    }
    if (payPeriod?.payFrequencyType === 5)
      return this.translateService.instant('Daily');
    if (payPeriod?.payFrequencyType === 6)
      return this.translateService.instant('TenDaily');
    return '';
  }
}
