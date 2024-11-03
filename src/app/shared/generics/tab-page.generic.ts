import { Directive } from '@angular/core';

import { GenericDestroy } from './generic-destroy-page';

@Directive()
export class GenericTabPage extends GenericDestroy {
  protected activeTabmenu: number = 0;
  protected pageKey: string = 'payrollSettingsSelectedTab';

  constructor() {
    super();
    const activeTabmenu = localStorage.getItem(this.pageKey);
    if (activeTabmenu)
      this.activeTabmenu = JSON.parse(activeTabmenu);
    else
      this.activeTabmenu = 0;
  }
}