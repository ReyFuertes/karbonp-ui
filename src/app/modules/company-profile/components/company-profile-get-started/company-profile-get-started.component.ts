import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';

import { AppDashboardType } from 'src/app/models/generic.enum';
import { IGettingStartedMock } from 'src/app/models/mock.model';
import { IApplication } from 'src/app/modules/employee/employee.model';
import { updateEmployeeAppAction } from 'src/app/modules/employee/store/employee-apps/employee-apps.action';
import { getEmployeeAppByNameSelector } from 'src/app/modules/employee/store/employee-apps/employee-apps.selector';
import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { CompanyProfileMock } from 'src/app/shared/mock/getting-started.mock';
import { formatToJson } from 'src/app/shared/util/formatting';
import { AppState } from 'src/app/store';

@Component({
  selector: 'kp-company-profile-get-started',
  templateUrl: './company-profile-get-started.component.html'
})
export class CompanyProfileGetStartedComponent extends GenericDestroy {
  public application: IApplication;
  public mock: IGettingStartedMock;

  constructor(private store: Store<AppState>, private router: Router) {
    super();
    this.mock = CompanyProfileMock;
    this.store.pipe(select(getEmployeeAppByNameSelector(AppDashboardType.CompanyProfile)))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((application: IApplication) => this.application = Object.assign({}, application, {
        options: formatToJson(application?.options)
      }));
  }

  public handleStartedChange(event: boolean): void {
    const payload = Object.assign({}, this.application, {
      options: JSON.stringify({ ...this.application.options, disabled: !event })
    });
    this.store.dispatch(updateEmployeeAppAction({ payload }));
  }
}
