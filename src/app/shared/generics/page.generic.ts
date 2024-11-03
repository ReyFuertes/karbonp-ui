import { Directive, Injector, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FormBuilder } from '@angular/forms';

import { LocalService } from 'src/app/services/local-storage.service';
import { GenericFormControls } from './form-control.generic';
import { CurrencyService } from 'src/app/services/common.service';
import { AppState } from 'src/app/store';
import { ConfirmationSeverityType, CountryISOCodeType, DialogStateType } from 'src/app/models/generic.enum';
import { IOptionItem } from 'src/app/models/generic.model';

@Directive()
export class GenericPage extends GenericFormControls {
  @ViewChild('cd', { static: true }) public cd!: ConfirmDialog;

  protected userId: string;
  protected currentPageKey: string = '';
  protected activeMenuOption: string;
  protected currentUserRole: string;
  protected currentCountryISOCode: string;
  protected currentCountryCurrencySymbol: string;
  protected localService: LocalService;
  protected currencyService: CurrencyService;
  protected store: Store<AppState>;
  protected router: Router;
  protected countryISOCodeType = CountryISOCodeType;
  protected translateService: TranslateService;
  protected confirmationService: ConfirmationService;
  protected fb: FormBuilder;
  protected confirmationSeverityStatus: ConfirmationSeverityType;
  protected dialogState: DialogStateType;
  protected showModal: boolean = false;
  protected messageService: MessageService;

  constructor(injector: Injector) {
    super();
    this.localService = injector.get(LocalService);
    this.currencyService = injector.get(CurrencyService);
    this.store = injector.get(Store);
    this.router = injector.get(Router);
    this.translateService = injector.get(TranslateService);
    this.confirmationService = injector.get(ConfirmationService);
    this.cd = injector.get(ConfirmDialog); //note: investigate might cause memory leak
    this.fb = injector.get(FormBuilder);
    this.messageService = injector.get(MessageService);

    const tokenDetails = this.localService.getEncItem('tokenDetails');
    if (tokenDetails) {
      const tokenDetail = JSON.parse(tokenDetails);
      this.currentCountryISOCode = tokenDetail?.CurrentCountryIsoCode;
      if (this.currentCountryISOCode)
        this.currentCountryCurrencySymbol = tokenDetail?.CurrentCountryCurrencySymbol;
      this.currencyService.use(this.currentCountryCurrencySymbol);
      this.currentUserRole = tokenDetail?.role;
      this.userId = tokenDetail?.nameid;
    }
  }

  protected translateOptionLabels(...allOptions: any): void {
    allOptions.forEach((options: IOptionItem[]) => {
      options?.map((option: IOptionItem) => {
        return Object.assign({}, option, { label: this.translateService?.instant(option?.label?.toString()) })
      });
    });
  }

  protected gotoRoute(pageKey: string, route: string): void {
    localStorage.setItem(pageKey, JSON.stringify(route));
    this.router.navigateByUrl(route);
  }

  protected setChipPaddings(value: any[]): void {
    setTimeout(() => {
      if (value?.length > 2) {
        document.querySelectorAll('.p-multiselect-chip .p-multiselect-token').forEach((el: any) => {
          el.style.margin = '0 8px 8px 0';
        });
      }
    }, 300);
  }

  protected showError(error: string): void {
    setTimeout(() => this.messageService.add({ severity: 'error', summary: error?.toString() }), 300);
  }

  protected onHide(): void {
    this.showModal = false;
    this.form.reset();
  }

  protected noImplementation(): void {
    alert('No Implementation');
  }
}