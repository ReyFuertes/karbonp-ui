import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

import { ExpensesContainerComponent } from './components/expenses-container/expenses-container.component';
import { ExpensesPageComponent } from './components/expenses-page/expenses-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { createTranslateLoader } from 'src/app/app.module';
import { InitAppEffect } from 'src/app/store/app.effect';
import { ExpensesSettingsComponent } from './components/expenses-settings/expenses-settings.component';
import { EmployeeAppsEffect } from '../employee/store/employee-apps/employee-apps.effect';
import { ExpensesGetStartedComponent } from './components/expenses-get-started/expenses-get-started.component';
import { GetStartedGuard } from 'src/app/services/get-started.guard';

const routes: Routes = [
  {
    path: '',
    component: ExpensesContainerComponent,
    children: [
      { path: '', component: ExpensesPageComponent, canActivate: [GetStartedGuard] },
      { path: 'get-started', component: ExpensesGetStartedComponent }
    ]
  }
];

@NgModule({
  declarations: [
    ExpensesContainerComponent,
    ExpensesPageComponent,
    ExpensesSettingsComponent,
    ExpensesGetStartedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BlockUIModule,
    PanelModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
    StoreModule.forFeature('expenses', {}),
    EffectsModule.forFeature([InitAppEffect, EmployeeAppsEffect]),
  ],
  exports: [],
  providers: [ConfirmationService],
})
export class ExpensesModule { }