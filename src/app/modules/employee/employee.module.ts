import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';

import { EmployeeMenuComponent } from './components/employee-menu/employee-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeContainerComponent } from './components/employee-container/employee-container.component';
import { EmployeeAddComponent } from './components/employee-add/employee-add.component';
import { EmployeeBasicsComponent } from './components/employee-basics/employee-basics.component';
import { EmployeeJobDetailsComponent } from './components/employee-job-details/employee-job-details.component';
import { EmployeeTimeOffComponent } from './components/employee-time-off/employee-time-off.component';
import { EmployeeSalaryComponent } from './components/employee-salary/employee-salary.component';
import { EmployeeOtherComponent } from './components/employee-other/employee-other.component';
import { EmployeeDetailPageComponent } from './components/employee-detail-page/employee-detail-page.component';
import { EmployeeQuickAddComponent } from './components/employee-quick-add/employee-quick-add.component';
import { EmployeeBulkImportComponent } from './components/employee-bulk-import/employee-bulk-import.component';
import { EmployeePersonalInfoComponent } from './components/employee-personal-info/employee-personal-info.component';
import { createTranslateLoader } from 'src/app/app.module';
import { EmployeePayrollComponent } from './components/employee-payroll/employee-payroll.component';
import { EmployeeDesignationComponent } from './components/employee-designation/employee-designation.component';
import { EmployeeWorkingHoursComponent } from './components/employee-working-hours/employee-working-hours.component';
import { EmployeeServiceComponent } from './components/employee-service/employee-service.component';
import { EmployeeDocumentsNotesComponent } from './components/employee-documents-notes/employee-documents-notes.component';
import { employeeReducers } from './store';
import { EmployeeSkillEquityComponent } from './components/employee-skills-equity/employee-skills-equity.component';
import { EmployeeTakeOnComponent } from './components/employee-take-on/employee-take-on.component';
import { EmployeeEffects } from './store/employee/employee.effect';
import { EmployeeTimeOffEffects } from './store/time-off/time-off.effect';
import { EmployeeJobDetailsEffects } from './store/employee-job-details/employee-job-details.effect';
import { EmployeeBasicDetailComponent } from './components/employee-basic-detail/employee-basic-detail.component';
import { EmployeeBankAccountDetailComponent } from './components/employee-bank-account-detail/employee-bank-account-detail.component';
import { EmployeeResidentialAddressDetailComponent } from './components/employee-residential-address-detail/employee-residential-address-detail.component';
import { EmployeePostalAddressComponent } from './components/employee-postal-address-detail/employee-postal-address-detail.component';
import { EmployeeBiographyDetailComponent } from './components/employee-biography-detail/employee-biography-detail.component';
import { EmployeeEmergencyContactDetailComponent } from './components/employee-emergency-contact-detail/employee-emergency-contact-detail.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeContainerComponent,
    children: [
      { path: 'menu', component: EmployeeMenuComponent },
      { path: 'add', component: EmployeeAddComponent },
      { path: 'detail/:id', component: EmployeeDetailPageComponent },
      { path: 'quick-add', component: EmployeeQuickAddComponent },
      { path: 'bulk-import', component: EmployeeBulkImportComponent }
    ]
  }
];

@NgModule({
  declarations: [
    EmployeeMenuComponent,
    EmployeeContainerComponent,
    EmployeeAddComponent,
    EmployeeBasicsComponent,
    EmployeeJobDetailsComponent,
    EmployeeTimeOffComponent,
    EmployeeSalaryComponent,
    EmployeeOtherComponent,
    EmployeeDetailPageComponent,
    EmployeePersonalInfoComponent,
    EmployeeQuickAddComponent,
    EmployeeBulkImportComponent,
    EmployeePayrollComponent,
    EmployeeDesignationComponent,
    EmployeeWorkingHoursComponent,
    EmployeeServiceComponent,
    EmployeeDocumentsNotesComponent,
    EmployeeSkillEquityComponent,
    EmployeeTakeOnComponent,
    EmployeeBasicDetailComponent,
    EmployeeBankAccountDetailComponent,
    EmployeeResidentialAddressDetailComponent,
    EmployeePostalAddressComponent,
    EmployeeBiographyDetailComponent,
    EmployeeEmergencyContactDetailComponent,
    EmployeeBiographyDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    TooltipModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    InputTextareaModule,
    DialogModule,
    CheckboxModule,
    ButtonModule,
    InputSwitchModule,
    ConfirmDialogModule,
    FileUploadModule,
    TabViewModule,
    ProgressBarModule,
    OverlayPanelModule,
    RadioButtonModule,
    PaginatorModule,
    EditorModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
    StoreModule.forFeature('employeeModule', employeeReducers),
    EffectsModule.forFeature([EmployeeEffects, EmployeeTimeOffEffects, EmployeeJobDetailsEffects]),
  ],
  exports: [],
  providers: [ConfirmationService],
})
export class EmployeeModule { }