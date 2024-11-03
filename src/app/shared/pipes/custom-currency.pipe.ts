import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyService } from 'src/app/services/common.service';

@Pipe({ name: 'currencySymbol' })
export class CustomCurrencyPipe extends CurrencyPipe implements PipeTransform {
  constructor(private currencyChange: CurrencyService) {
    super('en-za');
  }

  public override transform(value: string, digits: string = '1.2', currencySymbolOverride: string = null): any {
    let currencyToUse = this.currencyChange.currentCurrency;
    if (currencySymbolOverride != null && currencySymbolOverride != '')
      currencyToUse = currencySymbolOverride;
    return super.transform(value, currencyToUse, 'symbol-narrow', digits);
  }
}
