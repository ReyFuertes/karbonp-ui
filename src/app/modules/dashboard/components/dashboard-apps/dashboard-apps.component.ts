import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';

import { AppMenuConfigService } from 'src/app/services/common.service';
import { AppState } from 'src/app/store';
import { getEmployeeApplicationsSelector } from '../../../employee/store/employee-apps/employee-apps.selector';
import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { IApplication } from '../../../employee/employee.model';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { AppMenuType } from 'src/app/models/generic.enum';
import { TIMEOFF_PAGE_KEY, TIMEOFF_PAGE_PAYLOAD } from 'src/app/shared/constants/time-off.constant';
import { TimeOffMenuTypes } from 'src/app/modules/time-off/time-off.enum';

@Component({
  selector: 'kp-dashboard-apps',
  templateUrl: './dashboard-apps.component.html',
  styleUrls: ['./dashboard-apps.component.scss'],
  animations: [fadeInAnimation(100)]
})
export class DashboardAppsComponent extends GenericDestroy implements OnInit {
  public applications: IApplication[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private appMenuConfigService: AppMenuConfigService) {
    super();
  }

  ngOnInit(): void {
    this.store.pipe(select(getEmployeeApplicationsSelector))//note: add loading for apps
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((applications) => this.applications = applications);
  }

  public redirectTo(application: IApplication): void {
    const timeOffPagePayload = localStorage.getItem(TIMEOFF_PAGE_KEY);
    if (AppMenuType.TimeOff === application.menuType && timeOffPagePayload) {
      localStorage.removeItem(TIMEOFF_PAGE_PAYLOAD);
      localStorage.setItem(TIMEOFF_PAGE_KEY, JSON.stringify(TimeOffMenuTypes.Overview));
    }
    this.appMenuConfigService.setActiveApplication(application.options.route);
    this.appMenuConfigService.setRedirectMenuState('');
    if (application.options.disabled === false)
      this.router.navigateByUrl(application.options.route);
    //note: disable this for UI 1.5
    // else
    //   this.router.navigateByUrl(`${application.options.route}/get-started`);
  }

  public onAddApplication(): void {
    this.router.navigateByUrl('dashboard/apps/add');
  }
}
