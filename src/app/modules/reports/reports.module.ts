import { LOCALE_ID, NgModule } from '@angular/core';
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
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';

import { ReportsContainerComponent } from './components/reports-container/reports-container.component';
import { ReportsPageComponent } from './components/reports-page/reports-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { createTranslateLoader } from 'src/app/app.module';
import { ReportsSettingsComponent } from './components/reports-settings/reports-settings.component';
import { GetStartedGuard } from 'src/app/services/get-started.guard';
import { ReportsGetStartedComponent } from './components/reports-get-started/reports-get-started.component';
import { ReportsListComponent } from './components/reports-list/reports-list.component';
import { ReportsETIComponent } from './components/reports-eti/reports-eti.component';
import { ReportsBalancesComponent } from './components/reports-balances/reports-balances.component';
import { ReportsSkillsAndEquityComponent } from './components/reports-skills-equity/reports-skills-equity.component';
import { ReportsDetailedPayrollComponent } from './components/reports-detailed-payroll/reports-detailed-payroll.component';
import { ReportsInformationComponent } from './components/reports-information/reports-information.component';
import { ReportsMonthlyPaymentComponent } from './components/reports-monthly-payment/reports-monthly-payment.component';
import { ReportsTimeAttendanceComponent } from './components/reports-time-attendance/reports-time-attendance.component';
import { ReportsTimeOffBalancesComponent } from './components/reports-time-off-balances/reports-time-off-balances.component';
import { ReportsCreateEditComponent } from './components/reports-create-edit/reports-create-edit.component';
import { reportsReducers } from './store';
import { ReportsEffect } from './store/reports.effect';
import { CurrencyService } from 'src/app/services/common.service';
import { CustomCurrencyPipe } from 'src/app/shared/pipes/custom-currency.pipe';

const routes: Routes = [
  {
    path: '',
    component: ReportsContainerComponent,
    children: [
      {
        path: '',
        component: ReportsPageComponent,
        canActivate: [GetStartedGuard],
        children: [
          { path: 'list', component: ReportsListComponent },
          { path: 'eti', component: ReportsETIComponent },
          { path: 'balances', component: ReportsBalancesComponent },
          { path: 'skills-equity', component: ReportsSkillsAndEquityComponent },
          { path: 'detailed-payroll', component: ReportsDetailedPayrollComponent },
          { path: 'information', component: ReportsInformationComponent },
          { path: 'monthly-payment', component: ReportsMonthlyPaymentComponent },
          { path: 'time-attendance', component: ReportsTimeAttendanceComponent },
          { path: 'time-off-balances', component: ReportsTimeOffBalancesComponent },
          { path: 'create', component: ReportsCreateEditComponent },
          { path: 'edit', component: ReportsCreateEditComponent },
          { path: 'settings', component: ReportsSettingsComponent },
        ]
      },
      { path: 'get-started', component: ReportsGetStartedComponent }
    ]
  }
];

@NgModule({
  declarations: [
    ReportsContainerComponent,
    ReportsPageComponent,
    ReportsSettingsComponent,
    ReportsGetStartedComponent,
    ReportsListComponent,
    ReportsETIComponent,
    ReportsBalancesComponent,
    ReportsSkillsAndEquityComponent,
    ReportsDetailedPayrollComponent,
    ReportsInformationComponent,
    ReportsMonthlyPaymentComponent,
    ReportsTimeAttendanceComponent,
    ReportsTimeOffBalancesComponent,
    ReportsCreateEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BlockUIModule,
    PanelModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule,
    AccordionModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    CheckboxModule,
    MultiSelectModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
    StoreModule.forFeature('reportsModule', reportsReducers),
    EffectsModule.forFeature([ReportsEffect]),
  ],
  exports: [],
  providers: [
    CurrencyService, 
    CustomCurrencyPipe, 
    ConfirmationService,
    ConfirmDialog,
    {
      provide: LOCALE_ID,
      useValue: 'en' //note: we need to set correct lang culture from service
    }
  ],
})
export class ReportsModule { }