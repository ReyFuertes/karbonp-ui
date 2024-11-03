import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';

import { AppState } from 'src/app/store';
import { formatToJson } from 'src/app/shared/util/formatting';
import { IApplication } from '../modules/employee/employee.model';
import { getEmployeeAppByNameSelector } from '../modules/employee/store/employee-apps/employee-apps.selector';
import { AppMenuConfigService } from './common.service';

@Injectable()
export class GetStartedGuard {
  constructor(private store: Store<AppState>, private router: Router, private appMenuConfig: AppMenuConfigService) { }

  public canActivate() {
    return this.appMenuConfig.getActiveApplication()
      .pipe(
        switchMap((activeApplication: IApplication) => {
          return this.store.pipe(select(getEmployeeAppByNameSelector(activeApplication?.name)));
        }),
        filter((application) => !application?.options?.disabled),
        map((application: IApplication) => {
          const app = Object.assign({}, application, {
            options: formatToJson(application?.options)
          });
          if (app.options?.disabled === true) {
            this.router.navigateByUrl(`${app.options?.route}/get-started`);
            return false;
          }
          return true;
        }));
  }
}