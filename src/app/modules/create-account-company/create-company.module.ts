import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';

import { CreateAccountCompanyPageComponent } from './components/create-account-company-page/create-account-company-page.component';
import { CreateAccountCompanyContainerComponent } from './components/create-account-company-container/create-account-company-container.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { SetupCompanyComponent } from './components/setup-company/setup-company.component';

const routes: Routes = [
  {
    path: '',
    component: CreateAccountCompanyContainerComponent,
    children: [
      { path: 'sign-up', component: CreateAccountCompanyPageComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    CreateAccountCompanyContainerComponent,
    CreateAccountCompanyPageComponent,
    CreateAccountComponent,
    SetupCompanyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    PasswordModule,
    CheckboxModule,
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
  exports: [
    CreateAccountCompanyContainerComponent,
    CreateAccountCompanyPageComponent,
    CreateAccountComponent,
    SetupCompanyComponent
  ],
  providers: [],
})
export class CreateAccountCompanyModule { }