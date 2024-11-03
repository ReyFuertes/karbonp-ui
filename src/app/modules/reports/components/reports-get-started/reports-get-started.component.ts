import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { AppDashboardType } from 'src/app/models/generic.enum';

import { IGettingStartedMock } from 'src/app/models/mock.model';
import { IApplication } from 'src/app/modules/employee/employee.model';
import { updateEmployeeAppAction } from 'src/app/modules/employee/store/employee-apps/employee-apps.action';
import { getEmployeeAppByNameSelector } from 'src/app/modules/employee/store/employee-apps/employee-apps.selector';
import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { ReportsMock } from 'src/app/shared/mock/getting-started.mock';
import { formatToJson } from 'src/app/shared/util/formatting';
import { AppState } from 'src/app/store';

@Component({
  selector: 'kp-reports-get-started',
  templateUrl: './reports-get-started.component.html'
})
export class ReportsGetStartedComponent extends GenericDestroy {
  public application: IApplication;
  public mock: IGettingStartedMock;

  constructor(private store: Store<AppState>) {
    super();
    this.mock = ReportsMock;
    this.store.pipe(select(getEmployeeAppByNameSelector(AppDashboardType.Reports)))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((application: IApplication) => this.application = Object.assign({}, application, {
        options: formatToJson(application?.options)
      }));
  }

  public handleStartedChange(event: boolean): void {
    const payload = Object.assign({}, this.application, {
      options: JSON.stringify({ ...this.application.options, disabled: !event })
    })
    this.store.dispatch(updateEmployeeAppAction({ payload }));
  }
}
