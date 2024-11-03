import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { select } from '@ngrx/store';

import { AppDashboardType } from 'src/app/models/generic.enum';
import { DISABLED_EXPENSES } from 'src/app/shared/constants/wordings.constant';
import { GenericApplicationSetting } from 'src/app/shared/generics/application-settings.generic';
import { saveMonthlySettingReportsAction } from '../../store/reports.action';
import { getMonthlySettingReportSelector, getReportsLoadingSelector } from '../../store/reports.selector';

@Component({
  selector: 'kp-reports-settings',
  templateUrl: './reports-settings.component.html',
  styleUrls: ['./reports-settings.component.scss']
})
export class ReportsSettingsComponent extends GenericApplicationSetting implements OnInit {
  public disabledDescription: string = DISABLED_EXPENSES;

  constructor(injector: Injector, public fb: FormBuilder) {
    super(injector);
    this.appDashboardType = AppDashboardType.Reports;
    this.form = this.fb.group({
      id: new FormControl(0),
      includeBalancesReport: new FormControl(false),
      includeDetailedPayrollReport: new FormControl(false),
      includeEmployeeReport: new FormControl(false),
      includeEtiReport: new FormControl(false),
      includePayrollReport: new FormControl(false),
      language: new FormControl('en'), //note: need to look at the proper lang culture
    });
  }

  public override ngOnInit(): void {
    this.store.pipe(select(getMonthlySettingReportSelector))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(settings => {
        if (settings)
          this.form.patchValue(settings);
      })
  }

  public isLoadingAsync = () => this.store.pipe(select(getReportsLoadingSelector));

  public onSave(): void {
    this.store.dispatch(saveMonthlySettingReportsAction({ payload: this.form.value }));
  }
}
