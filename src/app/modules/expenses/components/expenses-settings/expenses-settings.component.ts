import { Component, Injector, } from '@angular/core';

import { AppDashboardType } from 'src/app/models/generic.enum';
import { DISABLED_EXPENSES } from 'src/app/shared/constants/wordings.constant';
import { GenericApplicationSetting } from 'src/app/shared/generics/application-settings.generic';

@Component({
  selector: 'kp-expenses-settings',
  templateUrl: './expenses-settings.component.html',
  styleUrls: ['./expenses-settings.component.scss']
})
export class ExpensesSettingsComponent extends GenericApplicationSetting {
  public disabledDescription: string = DISABLED_EXPENSES;

  constructor(injector: Injector) {
    super(injector);
    this.appDashboardType = AppDashboardType.Expenses;
  }
}
