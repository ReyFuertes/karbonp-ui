import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MegaMenuModule } from 'primeng/megamenu';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CloudinaryModule } from '@cloudinary/ng';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MultiSelectModule } from 'primeng/multiselect';

import { TopNavComponent } from './components/top-nav/top-nav.component';
import { InputTopnavSearchComponent } from './components/input-topnav-search/input-topnav-search.component';
import { HeaderContentComponent } from './components/header-content/header-content.component';
import { DropdownMultiSelectOptionComponent } from './components/dropdown-multi-select-option/dropdown-multi-select-option.component';
import { DropdownGroupSelectOptionComponent } from './components/dropdown-group-select-option/dropdown-group-select-option.component';
import { InputMultipleSelectChipComponent } from './components/input-multiple-select-chip/input-multiple-select-chip.component';
import { createTranslateLoader } from '../app.module';
import { InputSearchComponent } from './components/input-search/input-search.component';
import { ToggleSlideMenuComponent } from './components/toggle-slide-menu/toggle-slide-menu.component';
import { DisabledAppComponent } from './components/disable-app/disable-app.component';
import { GetStartedComponent } from './components/get-started/get-started.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DynamicFieldsComponent } from './components/dynamic-fields/dynamic-fields.component';
import { InputComponent } from './components/input/input.component';
import { DropdownSelectComponent } from './components/dropdown-select/dropdown-select.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SwitchComponent } from './components/switch/switch.component';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { SparklineComponent } from './components/charts-sparkline/sparkline.component';
import { DropdownMultiSelectComponent } from './components/dropdown-multi-select/dropdown-multi-select.component';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { PercentagePipe } from './pipes/percent.pipe';
import { PayPeriodDescriptionPipe } from './pipes/pay-period-description.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { DateSuffixPipe } from './pipes/date-suffix.pipe';

@NgModule({
  declarations: [
    TopNavComponent,
    InputTopnavSearchComponent,
    HeaderContentComponent,
    DropdownMultiSelectOptionComponent,
    DropdownGroupSelectOptionComponent,
    InputMultipleSelectChipComponent,
    InputSearchComponent,
    ToggleSlideMenuComponent,
    DisabledAppComponent,
    GetStartedComponent,
    PageNotFoundComponent,
    DynamicFieldsComponent,
    SafeHtmlPipe,
    InputComponent,
    DropdownSelectComponent,
    CalendarComponent,
    SwitchComponent,
    SparklineComponent,
    DropdownMultiSelectComponent,
    CustomCurrencyPipe,
    PercentagePipe,
    PayPeriodDescriptionPipe,
    DateFormatPipe,
    DateSuffixPipe
  ],
  imports: [
    CommonModule,
    OverlayPanelModule,
    DividerModule,
    CheckboxModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    MegaMenuModule,
    ButtonModule,
    PaginatorModule,
    ReactiveFormsModule,
    CloudinaryModule,
    InputSwitchModule,
    CalendarModule,
    NgxChartsModule,
    MultiSelectModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    TopNavComponent,
    HeaderContentComponent,
    DropdownMultiSelectOptionComponent,
    InputMultipleSelectChipComponent,
    InputSearchComponent,
    ToggleSlideMenuComponent,
    DisabledAppComponent,
    GetStartedComponent,
    InputTopnavSearchComponent,
    DynamicFieldsComponent,
    SafeHtmlPipe,
    InputComponent,
    DropdownSelectComponent,
    CalendarComponent,
    SwitchComponent,
    SparklineComponent,
    DropdownMultiSelectComponent,
    CustomCurrencyPipe,
    PercentagePipe,
    PayPeriodDescriptionPipe,
    DateFormatPipe,
    DateSuffixPipe
  ],
  providers: [
    CustomCurrencyPipe,
    PercentagePipe,
    PayPeriodDescriptionPipe,
    DateFormatPipe,
    DateSuffixPipe
  ],
})
export class SharedModule { }