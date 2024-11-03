import { Component, Injector } from '@angular/core';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getPayrollSettingsPayPeriodsAction } from '../../store/payroll-settings-pay-period/payroll-settings-pay-period.action';
import { getPayrollSettingsPayTypesAction } from '../../store/payroll-settings-pay-type/payroll-settings-pay-type.action';
import { getPayrollCalculationSetupAction } from '../../store/payroll-input/payroll-input.action';

@Component({
  selector: 'kp-payroll-settings',
  templateUrl: './payroll-settings.component.html',
  styleUrls: ['./payroll-settings.component.scss']
})
export class PayrollSettingsComponent extends GenericPage {
  public activeTabmenu: number = 0;
  public pageNumber: number = 1;
  public pagesize: number = 10;

  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(getPayrollSettingsPayPeriodsAction({
      payload: {
        active: null, pageNumber: this.pageNumber, pagesize: this.pagesize,
        payFrequencyType: null, sortAscending: true, sortBy: 'PayFrequencyType'
      }
    }));
    this.store.dispatch(getPayrollSettingsPayTypesAction({
      payload: {
        active: true, customItemType: null, pageNumber: this.pageNumber, pagesize: this.pagesize,
        searchText: '', sortAscending: true, sortBy: 'Name'
      }
    }));
    this.store.dispatch(getPayrollCalculationSetupAction());
    const payrollSettingsSelectedTab = localStorage.getItem('payrollSettingsSelectedTab');
    if (payrollSettingsSelectedTab)
      this.activeTabmenu = JSON.parse(payrollSettingsSelectedTab);
    else
      this.activeTabmenu = 0;
  }

  public handleTabChange(event: any): void {
    localStorage.setItem('payrollSettingsSelectedTab', JSON.parse(event?.index));
  }
}
