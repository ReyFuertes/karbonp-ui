import { Component, Injector } from '@angular/core';

import { AppMenuType, FormState } from 'src/app/models/generic.enum';
import { IOptionItem } from 'src/app/models/generic.model';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';
import { GenericMenuPage } from 'src/app/shared/generics/page-menu.generic';

@Component({
  selector: 'kp-payroll-page',
  templateUrl: './payroll-page.component.html',
  styleUrls: ['./payroll-page.component.scss']
})
export class payrollPageComponent extends GenericMenuPage {
  public state: FormState;
  public headerTitle: string = 'Payroll';
  public menusOptions: IOptionItem[] = [{
    label: 'Overview',
    value: 'overview',
  }, {
    label: 'Pay Runs',
    value: 'payruns'
  }, {
    label: 'Submissions',
    value: 'submissions'
  }, {
    label: 'Settings',
    value: 'settings'
  }];

  constructor(
    injector: Injector) {
    super(injector);
    this.setActiveMenu(AppMenuType.Reports);
    const overviewStrngfy = JSON.stringify('/payroll/overview');
    this.activeMenuOption = this.activeMenuOption ?? overviewStrngfy;
    const currentPayrollPage = localStorage.getItem(CURRENT_PAYRUN_PAGE_KEY);
    if (currentPayrollPage) {
      this.activeMenuOption = currentPayrollPage;
    }
    else
      this.activeMenuOption = overviewStrngfy;
    super.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, JSON.parse(this.activeMenuOption));
  }

  public override gotoRoute(selectedMenu: any): void {
    this.activeMenuOption = selectedMenu?.value;
    super.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, `/payroll/${this.activeMenuOption}`);
  }

  public getCurrentMenu(menuItem: IOptionItem): boolean {
    const paramChunks = this.router.url;
    return paramChunks.split('/')[2] === menuItem.value;
  }
}
