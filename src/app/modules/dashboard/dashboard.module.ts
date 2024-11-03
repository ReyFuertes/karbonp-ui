import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { HttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';

import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardContainerComponent } from './components/dashboard-container/dashboard-container.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { DashboardPeopleComponent } from './components/dashboard-people/dashboard-people.component';
import { DashboardAppsComponent } from './components/dashboard-apps/dashboard-apps.component';
import { createTranslateLoader } from 'src/app/app.module';
import { InitAppEffect } from 'src/app/store/app.effect';
import { EmployeeEffects } from '../employee/store/employee/employee.effect';
import { employeeReducers } from '../employee/store';
import { EmployeeAppsEffect } from '../employee/store/employee-apps/employee-apps.effect';
import { DashboardTodoListWidgetComponent } from './components/dashboard-todo-list-widget/dashboard-todo-list-widget.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardContainerComponent,
    children: [
      { path: '', component: DashboardPageComponent },
    ]
  }
];

@NgModule({
  declarations: [
    DashboardContainerComponent,
    DashboardPageComponent,
    DashboardPeopleComponent,
    DashboardAppsComponent,
    DashboardTodoListWidgetComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BlockUIModule,
    PanelModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
    StoreModule.forFeature('employeeModule', employeeReducers),
    EffectsModule.forFeature([InitAppEffect, EmployeeEffects, EmployeeAppsEffect]),
  ],
  exports: [],
  providers: [ConfirmationService, ConfirmDialog],
})
export class DashboardModule { }
