import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { HttpClient } from '@angular/common/http';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';

import { createTranslateLoader } from 'src/app/app.module';
import { CompanySettingContainerComponent } from './components/company-setting-container/company-setting-container.component';
import { CompanySettingPageComponent } from './components/company-setting-page/company-setting-page.component';


const routes: Routes = [
  {
    path: '',
    component: CompanySettingContainerComponent,
    children: [
      { path: '', component: CompanySettingPageComponent },
    ]
  }
];

@NgModule({
  declarations: [
    CompanySettingContainerComponent,
    CompanySettingPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    TabViewModule,
    OverlayPanelModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputMaskModule,
    PasswordModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
    EffectsModule.forFeature([]),
  ],
  exports: [],
  providers: [],
})
export class CompanySettingModule { }