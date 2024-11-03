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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChartModule } from 'primeng/chart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from '@fullcalendar/angular';
import { StepsModule } from 'primeng/steps';
import { AvatarModule } from 'primeng/avatar';

import { PayrollContainerComponent } from './components/payroll-container/payroll-container.component';
import { payrollPageComponent } from './components/payroll-page/payroll-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { createTranslateLoader } from 'src/app/app.module';
import { PayrollOverviewComponent } from './components/payroll-overview/payroll-overview.component';
import { PayrollMetricsComponent } from './components/payroll-metrics/payroll-metrics.component';
import { PayrollPayrunsComponent } from './components/payroll-payruns/payroll-payruns.component';
import { PayrollPayrunsDetailComponent } from './components/payroll-payruns-detail/payroll-payruns-detail.component';
import { PayrollSubmissionsComponent } from './components/payroll-submissions/payroll-submissions.component';
import { PayrollSettingsComponent } from './components/payroll-settings/payroll-settings.component';
import { PayrollSettingsPayperiodsComponent } from './components/payroll-settings-payperiods/payroll-settings-payperiods.component';
import { PayrollSettingsPayTypesComponent } from './components/payroll-settings-paytypes/payroll-settings-paytypes.component';
import { PayrollSettingsCalculationComponent } from './components/payroll-settings-calculations/payroll-settings-calculations.component';
import { PayrollSettingsPayslipsComponent } from './components/payroll-settings-payslips/payroll-settings-payslips.component';
import { PayrollSettingsbankComponent } from './components/payroll-settings-bank/payroll-settings-bank.component';
import { PayrollSettingsETIComponent } from './components/payroll-settings-eti/payroll-settings-eti.component';
import { payrollReducers } from './store';
import { PayrollOverViewEffect } from './store/overview/payroll-overview.effect';
import { PayrollPayrunInProgressEffect } from './store/payrun-in-progress/payroll-payrun-in-progress.effect';
import { PayrollPayrunCompletedEffect } from './store/payrun-completed/payroll-payruns-completed.effect';
import { PayrollPayrunTimetrackingIntegrationEffect } from './store/payroll-timetracking/payroll-timetracking.effect';
import { PayrollEditPayslipComponent } from './components/payroll-inprogress-edit-payslip/payroll-inprogress-edit-payslip.component';
import { PayrollEmployeeSetupComponent } from './components/payroll-employee-setup/payroll-employee-setup.component';
import { PayrollEmployeeSetupPayrollComponent } from './components/payroll-employee-setup-payroll/payroll-employee-setup-payroll.component';
import { PayrollEmployeeSetupPreviewPayslipComponent } from './components/payroll-employee-setup-preview-payslip/payroll-employee-setup-preview-payslip.component';
import { PayrollEmployeeSetupActivityComponent } from './components/payroll-employee-setup-activity/payroll-employee-setup-activity.component';
import { PayrollInprogressBulkUpdateComponent } from './components/payroll-inprogress-bulk-update/payroll-inprogress-bulk-update.component';
import { PayrollEmployeeSetupPayrollDeductionsDialogComponent } from './components/payroll-employee-setup-payroll-deductions-dialog/payroll-employee-setup-payroll-deductions-dialog.component';
import { PayrollEmployeeSetupPayrollAllowancesDialogComponent } from './components/payroll-employee-setup-payroll-allowances-dialog/payroll-employee-setup-payroll-allowances-dialog.component';
import { PayrollEmployeeSetupPayrollIncomeDialogComponent } from './components/payroll-employee-setup-payroll-income-dialog/payroll-employee-setup-payroll-income-dialog.component';
import { PayrollEmployeeSetupPayrollNotesPublicDialogComponent } from './components/payroll-employee-setup-payroll-notes-public-dialog/payroll-employee-setup-payroll-notes-public-dialog.component';
import { PayrollEmployeeSetupPayrollNotesPrivateDialogComponent } from './components/payroll-employee-setup-payroll-notes-private-dialog/payroll-employee-setup-payroll-notes-private-dialog.component';
import { PayrollEmployeeSetupPayrollBenefitsDialogComponent } from './components/payroll-employee-setup-payroll-benefits-dialog/payroll-employee-setup-payroll-benefits-dialog.component';
import { PayrollEmployeeSetupPayrollOtherDialogComponent } from './components/payroll-employee-setup-payroll-other-dialog/payroll-employee-setup-payroll-other-dialog.component';
import { PayrollPayrunInputEffect } from './store/payroll-input/payroll-input.effect';
import { PayrollInProgressBulkUpdatePageComponent } from './components/payroll-inprogress-bulk-update-page/payroll-inprogress-bulk-update-page.component';
import { PayrollPayrunBulkUpdateEffect } from './store/payrun-bulk-update/payrun-bulk-update.effect';
import { PayrollInProgressBulkUpdateCreateTableComponent } from './components/payroll-inprogress-bulk-update-create-table/payroll-inprogress-bulk-update-create-table.component';
import { PayrollInProgressBulkUpdateHoursComponent } from './components/payroll-inprogress-bulk-update-hours/payroll-inprogress-bulk-update-hours.component';
import { PayrollEmployeeSetupPayrollGoalGetterDialogComponent } from './components/payroll-employee-setup-payroll-goal-getter-dialog/payroll-employee-setup-payroll-goal-getter-dialog.component';
import { PayrollSetupAdditionalHoursComponent } from './components/payroll-employee-setup-additional-hours/payroll-employee-setup-additional-hours.component';
import { EmployeeEffects } from '../employee/store/employee/employee.effect';
import { PayrollPayrunsSchedulePaymentComponent } from './components/payroll-payruns-schedule-payment/payroll-payruns-schedule-payment.component';
import { PayrollPayrunPayPeriodEffect } from './store/payroll-settings-pay-period/payroll-settings-pay-period.effect';
import { PayrollPayrunPayTypeEffect } from './store/payroll-settings-pay-type/payroll-settings-pay-type.effect';
import { PayrollSettingsPaySlipSetupEffect } from './store/payroll-settings-payslip/payroll-settings-payslip.effect';
import { PayrollSettingsBankEffect } from './store/payroll-settings-bank/payroll-settings-bank.effect';
import { PayrollSettingsCalculationsEffect } from './store/payroll-settings-calculations/payroll-settings-calculations.effect';
import { PayrollSubmissionsEffect } from './store/payroll-submissions/payroll-submissions.effect';
import { PayrollSubmissionsMonthlyEmp201Component } from './components/payroll-submissions-monthly-emp201/payroll-submissions-monthly-emp201.component';
import { PayrollSubmissionsMonthlyUifComponent } from './components/payroll-submissions-monthly-uif/payroll-submissions-monthly-uif.component';
import { PayrollSubmissionsAnnualIrp5It3Component } from './components/payroll-submissions-annual-irp5-it3/payroll-submissions-annual-irp5-it3.component';
import { PayrollSubmissionsAnnualCoidaComponent } from './components/payroll-submissions-annual-coida/payroll-submissions-annual-coida.component';
import { PayrollSubmissionsPhilippinesComponent } from './components/payroll-submissions-philippines/payroll-submissions-philippines.component';
import { PayrollSubmissionsPhilippines1601cComponent } from './components/payroll-submissions-philippines-1601c/payroll-submissions-philippines-1601c.component';
import { PayrollSubmissionsPhilippinesAnnualComponent } from './components/payroll-submissions-philippines-annual/payroll-submissions-philippines-annual.component';
import { PayrollSubmissionsFilingDetailsDialogComponent } from './components/payroll-submissions-filing-details-dialog/payroll-submissions-filing-details-dialog.component';
import { PayrollFilingDetailEffect } from './store/payroll-filing-details/payroll-filing-details.effect';
import { PayrollPaymentDetailsComponent } from './components/payroll-payment-details/payroll-payment-details.component';
import { PayrollPaymentEffect } from './store/payroll-payment/payroll-payment.effect';
import { PayrollPaymentScheduleEffect } from './store/payroll-schedule-payment/payroll-schedule-payment.effect';

const routes: Routes = [
  {
    path: '',
    component: PayrollContainerComponent,
    children: [
      {
        path: '',
        component: payrollPageComponent,
        children: [
          { path: 'overview', component: PayrollOverviewComponent },
          { path: 'metrics', component: PayrollMetricsComponent },
          { path: 'payruns', component: PayrollPayrunsComponent },
          { path: 'payruns/detail', component: PayrollPayrunsDetailComponent },//note: check if needed to pass id
          { path: 'submissions', component: PayrollSubmissionsComponent },
          { path: 'submissions/philippines-1601c/:month', component: PayrollSubmissionsPhilippines1601cComponent },
          { path: 'payruns/edit/:id', component: PayrollEditPayslipComponent },
          { path: 'payruns/employee-setup/:employeeId/:payRunId', component: PayrollEmployeeSetupComponent },
          { path: 'payruns/bulk-update/:payRunId', component: PayrollInProgressBulkUpdatePageComponent },
          { path: 'payruns/employee-additional-hours/:payRunId', component: PayrollSetupAdditionalHoursComponent },
          { path: 'payruns/schedule-payment/:payRunId', component: PayrollPayrunsSchedulePaymentComponent },
          { path: 'payruns/payment-details/:payRunPaymentId', component: PayrollPaymentDetailsComponent },
          { path: 'settings', component: PayrollSettingsComponent }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    PayrollContainerComponent,
    payrollPageComponent,
    PayrollOverviewComponent,
    PayrollMetricsComponent,
    PayrollPayrunsComponent,
    PayrollPayrunsDetailComponent,
    PayrollSubmissionsComponent,
    PayrollSettingsComponent,
    PayrollSettingsPayperiodsComponent,
    PayrollSettingsPayTypesComponent,
    PayrollSettingsCalculationComponent,
    PayrollSettingsPayslipsComponent,
    PayrollSettingsbankComponent,
    PayrollSettingsETIComponent,
    PayrollEditPayslipComponent,
    PayrollEmployeeSetupComponent,
    PayrollEmployeeSetupPayrollComponent,
    PayrollEmployeeSetupPreviewPayslipComponent,
    PayrollEmployeeSetupActivityComponent,
    PayrollInprogressBulkUpdateComponent,
    PayrollEmployeeSetupPayrollDeductionsDialogComponent,
    PayrollEmployeeSetupPayrollAllowancesDialogComponent,
    PayrollEmployeeSetupPayrollIncomeDialogComponent,
    PayrollEmployeeSetupPayrollNotesPublicDialogComponent,
    PayrollEmployeeSetupPayrollNotesPrivateDialogComponent,
    PayrollEmployeeSetupPayrollBenefitsDialogComponent,
    PayrollEmployeeSetupPayrollOtherDialogComponent,
    PayrollInProgressBulkUpdateCreateTableComponent,
    PayrollInProgressBulkUpdatePageComponent,
    PayrollInProgressBulkUpdateHoursComponent,
    PayrollEmployeeSetupPayrollGoalGetterDialogComponent,
    PayrollSetupAdditionalHoursComponent,
    PayrollPayrunsSchedulePaymentComponent,
    PayrollSubmissionsMonthlyEmp201Component,
    PayrollSubmissionsMonthlyUifComponent,
    PayrollSubmissionsAnnualIrp5It3Component,
    PayrollSubmissionsAnnualCoidaComponent,
    PayrollSubmissionsPhilippinesComponent,
    PayrollSubmissionsPhilippines1601cComponent,
    PayrollSubmissionsPhilippinesAnnualComponent,
    PayrollSubmissionsFilingDetailsDialogComponent,
    PayrollPaymentDetailsComponent
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
    NgxChartsModule,
    TabViewModule,
    InputSwitchModule,
    ChartModule,
    OverlayPanelModule,
    MultiSelectModule,
    InputTextareaModule,
    FileUploadModule,
    FullCalendarModule,
    StepsModule,
    AvatarModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
    StoreModule.forFeature('payrollModule', payrollReducers),
    EffectsModule.forFeature([
      PayrollOverViewEffect,
      PayrollPayrunInProgressEffect,
      PayrollPayrunCompletedEffect,
      PayrollPayrunTimetrackingIntegrationEffect,
      PayrollPayrunInputEffect,
      PayrollPayrunBulkUpdateEffect,
      EmployeeEffects,
      PayrollPayrunPayPeriodEffect,
      PayrollPayrunPayTypeEffect,
      PayrollSettingsPaySlipSetupEffect,
      PayrollSettingsBankEffect,
      PayrollSettingsCalculationsEffect,
      PayrollSubmissionsEffect,
      PayrollFilingDetailEffect,
      PayrollPaymentEffect,
      PayrollPaymentScheduleEffect]),
  ],
  exports: [],
  providers: [
    ConfirmationService,
    ConfirmDialog,
    {
      provide: LOCALE_ID,
      useValue: 'en' //note: we need to set correct lang culture from service
    }
  ],
})
export class PayrollModule { }