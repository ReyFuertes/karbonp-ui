import { Component, Injector } from '@angular/core';
import { Store } from '@ngrx/store';

import { GenericMenuPage } from 'src/app/shared/generics/page-menu.generic';
import { AppState } from 'src/app/store';
import { environment } from 'src/environments/environment';
import { AppMenuType } from 'src/app/models/generic.enum';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { clearEmployeesEntitiesAction } from 'src/app/modules/employee/store/employee/employee.action';

@Component({
  selector: 'kp-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  animations: [fadeInAnimation(100)]
})
export class DashboardPageComponent extends GenericMenuPage {
  public avatarPath: string = '';
  public imgPath: string = environment.imgPath;

  constructor(injector: Injector, private store: Store<AppState>) {
    super(injector);
    this.avatarPath = this.imgPath + 'company-logo.jpg';
    this.setActiveMenu(AppMenuType.Dashboard);
    this.store.dispatch(clearEmployeesEntitiesAction());
  }
}
