import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { IOptionItem } from 'src/app/models/generic.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getSettingsBanksSetupSelector, getSettingsBankTypesSelector } from '../../store/payroll-settings-bank/payroll-settings-bank.selector';
import { getPayrollSettingsBanksAction, getPayrollSettingsBankTypesAction, savePayrollSettingsBankAction } from '../../store/payroll-settings-bank/payroll-settings-bank.action';
import { IBankSetup, IBankType } from '../../payroll.model';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-settings-bank',
  templateUrl: './payroll-settings-bank.component.html',
  styleUrls: ['./payroll-settings-bank.component.scss']
})
export class PayrollSettingsbankComponent extends GenericPage implements OnInit {
  public bankTransferOptions: IOptionItem[] = [];
  public banksSetupOptions: IBankSetup[];
  public bankTypeOptions: IBankType[];

  constructor(injector: Injector) {
    super(injector);
    const payload = { active: true, implementSortingAndPaging: false };
    this.store.dispatch(getPayrollSettingsBanksAction({ payload }));
    this.store.dispatch(getPayrollSettingsBankTypesAction({ payload }));
    this.form = new FormGroup({
      type: new FormControl(null, Validators.required),
      bankId: new FormControl(null, Validators.required),
      accountNumber: new FormControl(null, Validators.required),
      branchCode: new FormControl(null, Validators.required),
      accountTypeId: new FormControl(null, Validators.required),
      active: new FormControl(true)
    })
    this.bankTransferOptions?.push({
      label: 'FNB (ACB)',
      value: 1
    }, {
      label: 'Standard Bank (SSVS)',
      value: 2
    })
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSettingsBanksSetupSelector)),
      this.store.pipe(select(getSettingsBankTypesSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([banks, bankTypes]) => {
        this.banksSetupOptions = banks;
        this.bankTypeOptions = bankTypes;
      })
  }

  public onSave(): void {
    if (this.form.valid)
      this.store.dispatch(savePayrollSettingsBankAction({ payload: this.form.value }));
    else
      console.log('Form invalid');
  }

  public onCancel(): void {
    this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, '/payroll/overview')
    localStorage.removeItem('payrollSettingsSelectedTab');
  }
}
