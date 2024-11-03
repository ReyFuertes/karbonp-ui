import { Directive, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { IApplication } from 'src/app/modules/employee/employee.model';
import { updateEmployeeAppAction } from 'src/app/modules/employee/store/employee-apps/employee-apps.action';
import { formatToJson } from '../util/formatting';
import { getEmployeeAppByNameSelector } from 'src/app/modules/employee/store/employee-apps/employee-apps.selector';
import { GenericFormControls } from './form-control.generic';
import { AppDashboardType } from 'src/app/models/generic.enum';
import { AppState } from 'src/app/store';
import { DASHBOARDROUTE } from '../constants/route.constant';

@Directive()
export class GenericApplicationSetting extends GenericFormControls implements OnInit {
  @ViewChild("cd") protected cd: ConfirmDialog | undefined;

  protected application: IApplication;
  protected appDashboardType: AppDashboardType;
  protected store: Store<AppState>;
  protected confirmationService: ConfirmationService;
  protected router: Router;

  constructor(injector: Injector) {
    super();
    this.store = injector.get(Store);
    this.confirmationService = injector.get(ConfirmationService);
    this.router = injector.get(Router);
  }

  public ngOnInit(): void {
    this.store.pipe(select(getEmployeeAppByNameSelector(this.appDashboardType)))
      .subscribe((application) => {
        this.application = Object.assign({}, application, {
          options: formatToJson(application?.options)
        });
      });
  }

  public handleOnDisableChange(): void {
    const isDisabled = this.application.options?.disabled || false;
    this.confirmationService.confirm({
      message: `Are you sure you want to ${!isDisabled ? 'disabled' : 'enabled'} ${this.appDashboardType}?`,
      accept: () => {
        this.application = Object.assign({}, this.application, {
          options: { ...this.application.options, disabled: !isDisabled }
        });
        this.store.dispatch(updateEmployeeAppAction({
          payload: Object.assign({}, this.application, {
            options: JSON.stringify(this.application.options)
          })
        }));
        if (this.application.options?.disabled === true)
          this.router.navigateByUrl(DASHBOARDROUTE);
      },
      reject: () => this.cd.reject()
    });
  }
}
