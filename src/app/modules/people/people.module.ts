import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragScrollItemDirective, DragScrollComponent } from 'ngx-drag-scroll';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

import { PeopleContainerComponent } from './components/people-container/people-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PeoplePageComponent } from './components/people-page/people-page.component';
import { PeopleDirectoryComponent } from './components/people-directory/people-directory.component';
import { PeopleOrgChartComponent } from './components/people-org-chart/people-org-chart.component';
import { PeopleCustomFieldsComponent } from './components/people-custom-fields/people-custom-fields.component';
import { PeopleTeamsComponent } from './components/people-teams/people-teams.component';
import { PeopleService } from './people.service';
import { EmployeeEffects } from '../employee/store/employee/employee.effect';
import { EmployeeTimeOffEffects } from '../employee/store/time-off/time-off.effect';
import { PeopleSettingsComponent } from './components/people-settings/people-settings.component';
import { PeopleStatusEffects } from './store/people-status/people-status.effect';
import { PeopleDirectoryFilterComponent } from './components/people-directory-filter/people-directory-filter.component';
import { peopleReducers } from './store';

const routes: Routes = [
  {
    path: '',
    component: PeopleContainerComponent,
    children: [
      { path: '', component: PeoplePageComponent }
    ]
  }
];

@NgModule({
  declarations: [
    PeopleContainerComponent,
    PeoplePageComponent,
    PeopleDirectoryComponent,
    PeopleOrgChartComponent,
    PeopleCustomFieldsComponent,
    PeopleTeamsComponent,
    PeopleSettingsComponent,
    PeopleDirectoryFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DragScrollComponent,
    DragScrollItemDirective,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,
    TooltipModule,
    OverlayPanelModule,
    PaginatorModule,
    TabViewModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextareaModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('peopleModule', peopleReducers),
    EffectsModule.forFeature([PeopleStatusEffects, EmployeeEffects, EmployeeTimeOffEffects]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  exports: [],
  providers: [PeopleService, ConfirmationService],
})
export class PeopleModule { }