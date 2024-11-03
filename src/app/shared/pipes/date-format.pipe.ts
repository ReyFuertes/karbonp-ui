import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common'

import { TranslateService } from '@ngx-translate/core';

@Pipe({  name: 'dateformat'})
export class DateFormatPipe implements PipeTransform {
  constructor(private datePipe: DatePipe, private translateService: TranslateService) { //, private bsLocaleService: BsLocaleService
  }

  public transform(value: any, format?: string, locale?: string, localize: boolean = true): string {
    if (value === null || value === '') return '';
    const date = new Date(value);
    const transformedDate = new Date(date.getTime() + (date.getTimezoneOffset() * -60000));
    if (locale === null || locale === '') {
      locale = this.translateService.currentLang;
    }
    //this.bsLocaleService.use(locale);
    if (format === null || format === '')
      format = 'dd MMM yyyy HH:mm';
    if ((format === 'dd MMM yyyy HH:mm' || format === 'HH:mm') && localize == false) {
      return this.datePipe.transform(date, format, null, null);
    }
    if (format === 'dd MMM yyyy HH:mm' || format === 'HH:mm') {
      return this.datePipe.transform(transformedDate, format, null, locale);
    }
    else {
      return this.datePipe.transform(date, format, null, locale);
    }
  }
}
