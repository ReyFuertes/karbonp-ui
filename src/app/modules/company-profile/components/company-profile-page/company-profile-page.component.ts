import { Component, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AppMenuType } from 'src/app/models/generic.enum';
import { IOptionItem } from 'src/app/models/generic.model';
import { GenericMenuPage } from 'src/app/shared/generics/page-menu.generic';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kp-company-profile-page',
  templateUrl: './company-profile-page.component.html',
  styleUrls: ['./company-profile-page.component.scss']
})
export class CompanyProfilePageComponent extends GenericMenuPage {
  public avatarPath: string = '';
  public imgPath: string = environment.imgPath;
  public form: FormGroup;
  public menus: IOptionItem[] = [{
    label: 'Overview',
    value: 'overview'
  }, {
    label: 'Tools',
    value: 'tools'
  }, {
    label: 'Files',
    value: 'files'
  }, {
    label: 'Policies',
    value: 'policies'
  }, {
    label: 'Settings',
    value: 'settings'
  }];

  constructor(injector: Injector) {
    super(injector);
    this.avatarPath = this.imgPath + 'sample-employee-logo.png';
    this.setActiveMenu(AppMenuType.CompanyProfile);
    this.activeMenuOption = this.activeMenuOption ?? 'overview';
  }

  public gotoMenu(selectedMenu: any): void {
    this.activeMenuOption = selectedMenu.value;
  }
  
  public getCurrentMenu(menuItem: IOptionItem): boolean {
    return menuItem.value === this.activeMenuOption;
  }
}
