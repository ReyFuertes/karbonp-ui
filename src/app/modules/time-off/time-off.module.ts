import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { CheckboxModule } from 'primeng/checkbox';

import { TimeOffEffect } from './store/time-off.effect';
import { SharedModule } from 'src/app/shared/shared.module';
import { createTranslateLoader } from 'src/app/app.module';
import { TimeOffContainerComponent } from './components/time-off-container/time-off-container.component';
import { TimeOffPageComponent } from './components/time-off-page/time-off-page.component';
import { TimeoffOverviewComponent } from './components/time-off-overview/time-off-overview.component';
import { TimeOffCalendarComponent } from './components/time-off-calendar/time-off-calendar.component';
import { TimeOffSettingsComponent } from './components/time-off-settings/time-off-settings.component';
import { reducers } from './store';
import { EmployeeEffects } from '../employee/store/employee/employee.effect';
import { TimeOffBalancesComponent } from './components/time-off-balances/time-off-balances.component';
import { InitAppEffect } from 'src/app/store/app.effect';
import { TimeOffRequestComponent } from './components/time-off-request/time-off-request.component';
import { TimeOffsGetStartedComponent } from './components/time-off-get-started/time-off-get-started.component';
import { GetStartedGuard } from 'src/app/services/get-started.guard';


const routes: Routes = [
  {
    path: '',
    component: TimeOffContainerComponent,
    children: [
      { path: '', component: TimeOffPageComponent, canActivate: [GetStartedGuard] },
      { path: 'time-off-requests/:id', component: TimeOffRequestComponent },
      { path: 'get-started', component: TimeOffsGetStartedComponent }
    ]
  }
];

@NgModule({
  declarations: [
    TimeOffContainerComponent,
    TimeOffPageComponent,
    TimeoffOverviewComponent,
    TimeOffCalendarComponent,
    TimeOffSettingsComponent,
    TimeOffBalancesComponent,
    TimeOffRequestComponent,
    TimeOffsGetStartedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FullCalendarModule,
    TooltipModule,
    OverlayPanelModule,
    MultiSelectModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    CalendarModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextareaModule,
    InputSwitchModule,
    TabViewModule,
    FileUploadModule,
    ProgressBarModule,
    CheckboxModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('timeOffModule', reducers),
    EffectsModule.forFeature([TimeOffEffect, EmployeeEffects, InitAppEffect]),
  ],
  exports: [],
  providers: [ConfirmationService, ConfirmDialog],
})
export class TimeOffModule { }
