import { Component, Injector } from '@angular/core';

import { AppMenuType, FormState } from 'src/app/models/generic.enum';
import { IOptionItem } from 'src/app/models/generic.model';
import { GenericMenuPage } from 'src/app/shared/generics/page-menu.generic';
import { ReportsStateService } from '../../reports.service';
import { takeUntil } from 'rxjs';
import { getMonthlySettingReportsAction } from '../../store/reports.action';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';

@Component({
  selector: 'kp-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss']
})
export class ReportsPageComponent extends GenericMenuPage {
  public state: FormState;
  public headerTitle: string = 'Reports';
  public menusOptions: IOptionItem[] = [{
    label: 'Reports',
    value: 'list',
  }, {
    label: 'Settings',
    value: 'settings'
  }];

  constructor(
    injector: Injector,
    private store: Store<AppState>,
    private reportsService: ReportsStateService) {
    super(injector);
    this.setActiveMenu(AppMenuType.Reports);
    this.store.dispatch(getMonthlySettingReportsAction());
    this.activeMenuOption = this.activeMenuOption ?? 'list';
    const employeeDetailSelectedMenu = localStorage.getItem('reportsSelectedMenu');
    const reportsSelectedItemMenu = localStorage.getItem('reportsListSelectedItemMenu');
    if (employeeDetailSelectedMenu)
      this.activeMenuOption = employeeDetailSelectedMenu;
    else
      this.activeMenuOption = 'list';
    if (this.activeMenuOption === 'list') {
      if (reportsSelectedItemMenu) {
        const activeItemMenu = JSON.parse(reportsSelectedItemMenu);
        localStorage.setItem('reportsListSelectedItemMenu', JSON.stringify(activeItemMenu));
        this.router.navigateByUrl(`/reports/${activeItemMenu}`);
        return;
      }
      this.gotoMenu({ value: this.activeMenuOption });
    } else if (this.activeMenuOption === 'settings')
      this.gotoMenu({ value: this.activeMenuOption });
    this.reportsService.getState()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((value => {
        if (value === FormState.add)
          this.headerTitle = `Create Report`;
        else if (value === FormState.edit)
          this.headerTitle = `Edit Report`;
        else
          this.headerTitle = `Report`;
      }))
  }

  public triggerChanges(compName: string): void {
    switch (compName) {
      case 'settings':
        break;
      default:
        break;
    }
  }

  public gotoMenu(selectedMenu: any): void {
    this.activeMenuOption = selectedMenu.value;
    if (selectedMenu?.value === 'reports')
      this.router.navigateByUrl(`/reports`);
    else
      this.router.navigateByUrl(`/reports/${selectedMenu?.value}`);
    localStorage.setItem('reportsSelectedMenu', this.activeMenuOption);
    if (selectedMenu.value === 'list')
      localStorage.removeItem('reportsListSelectedItemMenu');
  }

  public getCurrentMenu(menuItem: IOptionItem): boolean {
    return menuItem.value === this.activeMenuOption;
  }
}
