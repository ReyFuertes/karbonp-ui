import { Component } from '@angular/core';

import { IOptionItem } from 'src/app/models/generic.model';

@Component({
  selector: 'kp-toggle-slide-menu',
  templateUrl: './toggle-slide-menu.component.html',
  styleUrls: ['./toggle-slide-menu.component.scss']
})
export class ToggleSlideMenuComponent {
  public selectedMenu: number = 0;
  public menus: IOptionItem[] = [{
    label: 'Everyone',
    value: 'person'
  }, {
    label: 'Offices',
    value: 'location_on'
  }, {
    label: 'Teams',
    value: 'group'
  }];
  constructor() { }

  public setWidth(index: number): void {
    if (index !== this.selectedMenu)
      this.selectedMenu = index;
  }
}
