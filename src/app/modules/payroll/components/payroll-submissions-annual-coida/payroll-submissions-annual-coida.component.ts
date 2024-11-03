import { Component, Injector, OnInit } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';
import * as moment from 'moment';
import { FormControl, Validators } from '@angular/forms';

import { IOptionItem, ISouthAfricaRegulatedSetting } from 'src/app/models/generic.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getDownloadedCOIDAReportSubmissionSelector, getPayrollIncomeAndBenefitTypesSubmissionsSelector, getPayrollTaxSeasonsSubmissionsSelector, getSouthAfricaRegulatedSettingSelector } from '../../store/payroll-submissions/payroll-submissions.selector';
import { IIncomeAndBenefitTypes, ITaxSeason } from '../../payroll.model';
import { generateCOIDAReportSubmissionsAction, southAfricaRegulatedSettingsSubmissionsAction } from '../../store/payroll-submissions/payroll-submissions.action';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';

@Component({
  selector: 'kp-payroll-submissions-annual-coida',
  templateUrl: './payroll-submissions-annual-coida.component.html',
  styleUrls: ['./payroll-submissions-annual-coida.component.scss']
})
export class PayrollSubmissionsAnnualCoidaComponent extends GenericPage implements OnInit {
  public selectedTaxSeason: any;
  public taxSeasons: IOptionItem[] = [];
  public incomeAndBenefitTypes: IIncomeAndBenefitTypes;
  public incomesOptions: IOptionItem[];
  public benefitsOptions: IOptionItem[];
  public downloadedCOIDAReport: any;
  public southAfricaRegulatedSetting: ISouthAfricaRegulatedSetting;

  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(southAfricaRegulatedSettingsSubmissionsAction({ regulatedSettingsId: '0' })); //note why 0?
    this.form = this.fb.group({
      taxSeason: new FormControl(undefined, Validators.required),
      benefitTypes: new FormControl(undefined),
      incomeTypes: new FormControl(undefined),
      fromDate: new FormControl(''),
      toDate: new FormControl(undefined),
      growthPercentage: new FormControl(undefined)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollTaxSeasonsSubmissionsSelector)),
      this.store.pipe(select(getPayrollIncomeAndBenefitTypesSubmissionsSelector)),
      this.store.pipe(select(getDownloadedCOIDAReportSubmissionSelector)),
      this.store.pipe(select(getSouthAfricaRegulatedSettingSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([taxSeasons, incomeAndBenefitTypes, downloadedCOIDAReport, southAfricaRegulatedSetting]) => {
        this.taxSeasons = taxSeasons?.map((tax: ITaxSeason) => {
          const fromDate = moment(tax?.fromDate).format('DD MMM YYYY');
          const toDate = moment(tax?.toDate).format('DD MMM YYYY');
          return {
            label: `${fromDate} - ${toDate}`,
            value: JSON.stringify({ fromDate, toDate })
          };
        });
        this.incomeAndBenefitTypes = incomeAndBenefitTypes;
        this.benefitsOptions = incomeAndBenefitTypes?.benefitTypes?.map(benefit => {
          return ({ label: this.translateService.instant(benefit), value: benefit })
        });
        this.incomesOptions = incomeAndBenefitTypes?.incomesTypes?.map(income => {
          return ({ label: this.translateService.instant(income), value: income })
        });
        this.downloadedCOIDAReport = downloadedCOIDAReport;
        if (this.downloadedCOIDAReport) {
          const taxSeasonsValue = this.form.get('taxSeason').value;
          if (taxSeasonsValue) {
            const { fromDate, toDate } = JSON.parse(taxSeasonsValue);
            const downloadedPayslip = this.downloadedCOIDAReport?.get(`${moment(fromDate).format('DD/MM/YYYY')}${moment(toDate).format('DD/MM/YYYY')}`);
            if (downloadedPayslip) {
              try {
                processPayrunDownload(downloadedPayslip?.data, 'COIDA Submission.xlsx');
              } catch (error) {
                this.showError(error as string);
              }
            }
          }
        }
        this.southAfricaRegulatedSetting = southAfricaRegulatedSetting;
        if (this.southAfricaRegulatedSetting)
          this.form.get('growthPercentage').patchValue(this.southAfricaRegulatedSetting?.coidaSettings?.defaultGrowthPercentage)
      })
  }

  public onGenerate(): void {
    const taxSeasonsValue = this.form.get('taxSeason').value;
    if (taxSeasonsValue) {
      const { fromDate, toDate } = JSON.parse(taxSeasonsValue);
      const payload = {
        fromDate: moment(fromDate).format('DD/MM/YYYY'),
        toDate: moment(toDate).format('DD/MM/YYYY'),
        growthPercentage: this.form.get('growthPercentage').value,
        benefitTypes: this.form.get('benefitTypes').value || [],
        incomeTypes: this.form.get('incomeTypes').value || []
      }
      this.store.dispatch(generateCOIDAReportSubmissionsAction({ payload }))
    }
    else
      console.log('Invalid form')
  }

  public onChangeTax(event: any): void {
    console.log('Not implemented..', event)
  }
}
