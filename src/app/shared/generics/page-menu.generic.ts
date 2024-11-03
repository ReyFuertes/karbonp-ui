import { Directive, Injector } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

import { GenericDestroy } from './generic-destroy-page';
import { SideBarService } from 'src/app/services/sidebar.service';
import { AppMenuConfigService } from 'src/app/services/common.service';
import { AppMenuType } from 'src/app/models/generic.enum';

@Directive()
export class GenericMenuPage extends GenericDestroy {
  protected activeMenuOption: 'overview' | 'requests' | 'balances' | 'calendar' | 'settings' | 'tools' | 'files' | 'policies' | 'directory' | 'org_chart' | 'custom_fields' | 'teams' |
    'personal_info' | 'time_off' | 'designation' | 'working_hours' | 'employee_service' | 'documents_notes' | 'employee_skills_equity' | 'employee_take_on' | string = '';
  protected sideBarService: SideBarService;
  protected confirmationService: ConfirmationService;
  protected appMenuConfigService: AppMenuConfigService;
  protected router: Router;

  constructor(injector: Injector) {
    super();
    this.sideBarService = injector.get(SideBarService);
    this.confirmationService = injector.get(ConfirmationService);
    this.appMenuConfigService = injector.get(AppMenuConfigService);
    this.router = injector.get(Router);

    this.appMenuConfigService.getRedirectMenuState()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(((redirectToMenu: any) => {
        if (redirectToMenu)
          this.activeMenuOption = (redirectToMenu) as any;
        else
          this.activeMenuOption = undefined;
      }));
  }

  protected gotoRoute(pageKey: string, route: string): void {
    localStorage.setItem(pageKey, JSON.stringify(route));
    this.router.navigateByUrl(route);
  }

  protected setActiveMenu(activeMenu: AppMenuType): void {
    this.sideBarService.setSidebarActiveMenu(activeMenu);
  }
}
