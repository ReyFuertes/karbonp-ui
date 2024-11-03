import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { CompanyProfilePageComponent } from './components/company-profile-page/company-profile-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyProfileContainerComponent } from './components/company-profile-container/company-profile-container.component';
import { createTranslateLoader } from 'src/app/app.module';
import { AutoFocusDirective } from 'src/app/shared/directive/autofocus.directive';
import { CompanyProfileDialogOfficeComponent } from './components/company-profile-dialog-office/company-profile-dialog-office.component';
import { CompanyProfileDialogAddressComponent } from './components/company-profile-dialog-address/company-profile-dialog-address.component';
import { CompanyProfileOverviewComponent } from './components/company-profile-overview/company-profile-overview.component';
import { CompanyProfileToolsComponent } from './components/company-profile-tools/company-profile-tools.component';
import { CompanyProfileFilesComponent } from './components/company-profile-files/company-profile-files.component';
import { CompanyProfilePoliciesComponent } from './components/company-profile-policies/company-profile-policies.component';
import { CompanyProfileSettingsComponent } from './components/company-profile-settings/company-profile-settings.component';
import { CompanyProfileGetStartedComponent } from './components/company-profile-get-started/company-profile-get-started.component';
import { GetStartedGuard } from 'src/app/services/get-started.guard';

const routes: Routes = [
  {
    path: '',
    component: CompanyProfileContainerComponent,
    children: [
      { path: '', component: CompanyProfilePageComponent, canActivate: [GetStartedGuard] },
      { path: 'get-started', component: CompanyProfileGetStartedComponent }
    ]
  }
];

@NgModule({
  declarations: [
    CompanyProfileContainerComponent,
    CompanyProfilePageComponent,
    CompanyProfileDialogAddressComponent,
    CompanyProfileDialogOfficeComponent,
    CompanyProfileOverviewComponent,
    AutoFocusDirective,
    CompanyProfileToolsComponent,
    CompanyProfileFilesComponent,
    CompanyProfilePoliciesComponent,
    CompanyProfileSettingsComponent,
    CompanyProfileGetStartedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    ConfirmDialogModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  exports: [],
  providers: [ConfirmationService],
})
export class CompanyProfileModule { }