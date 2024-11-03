import { Component, Injector } from '@angular/core';
import { AppMenuType } from 'src/app/models/generic.enum';

import { IOptionItem } from 'src/app/models/generic.model';
import { GenericMenuPage } from 'src/app/shared/generics/page-menu.generic';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kp-expenses-page',
  templateUrl: './expenses-page.component.html',
  styleUrls: ['./expenses-page.component.scss']
})
export class ExpensesPageComponent extends GenericMenuPage {
  public avatarPath: string = '';
  public imgPath: string = environment.imgPath;
  public svgPath: string = environment.svgPath;
  public menusOptions: IOptionItem[] = [{
    label: 'Settings',
    value: 'settings'
  }];

  constructor(injector: Injector) {
    super(injector);
    this.avatarPath = this.svgPath + 'mcdo-logo.svg';
    this.setActiveMenu(AppMenuType.Expenses);
    this.activeMenuOption = this.activeMenuOption ?? 'settings';
  }

  public triggerChanges(compName: string): void {
    switch (compName) {
      case 'settings':
        break;
      default:
        break;
    }
  }

  public gotoMenu(selectedMenu: IOptionItem): void {
    this.activeMenuOption = selectedMenu.value;
  }

  public getCurrentMenu(menuItem: IOptionItem): boolean {
    return menuItem.value === this.activeMenuOption;
  }
}
