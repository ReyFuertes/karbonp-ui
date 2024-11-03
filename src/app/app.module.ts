import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelModule } from 'primeng/panel';
import { SidebarModule } from 'primeng/sidebar';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JwtModule } from '@auth0/angular-jwt';
import { BlockUIModule } from 'primeng/blockui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BlockUIService } from './services/blockui.service';
import { SideBarService } from './services/sidebar.service';
import { TokenInterceptor } from './services/http-token-interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './services/auth.guard';
import { LocalService } from './services/local-storage.service';
import { InitAppEffect } from './store/app.effect';
import { tokenGetter } from './shared/util/func.util';
import { EmployeeAppsEffect } from './modules/employee/store/employee-apps/employee-apps.effect';
import { GetStartedGuard } from './services/get-started.guard';
import { CreateAccountCompanyModule } from './modules/create-account-company/create-company.module';
import { PeopleStatusEffects } from './modules/people/store/people-status/people-status.effect';
import { EmployeeEffects } from './modules/employee/store/employee/employee.effect';
import { peopleReducers } from './modules/people/store';
import { employeeReducers } from './modules/employee/store';
import { reducers } from './store';
import { CustomCurrencyPipe } from './shared/pipes/custom-currency.pipe';
import { BlockableComponent } from './shared/components/blockable/blockable.component';

export const featureReducers = [
  StoreModule.forFeature('peopleModule', peopleReducers),
  StoreModule.forFeature('employeeModule', employeeReducers),
];

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BlockableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    PanelModule,
    SidebarModule,
    AuthModule,
    ToastModule,
    BlockUIModule,
    CreateAccountCompanyModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: { tokenGetter: tokenGetter }
    }),
    AppRoutingModule,
    StoreModule.forRoot({
      ...reducers,
      ...peopleReducers,
      ...employeeReducers,
    }),
    EffectsModule.forRoot([InitAppEffect, EmployeeEffects, EmployeeAppsEffect, PeopleStatusEffects]),
    featureReducers
  ],
  providers: [
    AuthGuard,
    LocalService,
    BlockUIService,
    SideBarService,
    MessageService,
    GetStartedGuard,
    CustomCurrencyPipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

