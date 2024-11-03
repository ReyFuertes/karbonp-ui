import { Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select } from '@ngrx/store';
import * as moment from 'moment';
import { combineLatest, takeUntil } from 'rxjs';

import { IGetPayRunsPerMonthOverview, IGrossSalaryByMonthlyFinancialYear } from '../../payroll.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { CHARTBORDERCOLORS, CHARTCOLUMNBGCOLORS } from 'src/app/shared/constants/chart.constant';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { getGrossSalariesByMonthForFinancialYearAction, getPayRunsPerMonthOverviewAction } from '../../store/overview/payroll-overview.action';
import { getGetPayRunsPerMonthOverviewSelector, getGrossSalariesByMonthForFinancialYearSelector, getPayrollLoadingSelector } from '../../store/overview/payroll-overview.selector';
import { getTodoListWidgetDataAction } from 'src/app/store/app.action';

@Component({
  selector: 'kp-payroll-overview',
  templateUrl: './payroll-overview.component.html',
  styleUrls: ['./payroll-overview.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class PayrollOverviewComponent extends GenericPage implements OnInit {
  public grossSparklineData: any;//note: not implement per darren for now
  public salaryData: any;
  public payRunsPerMonthOverview: IGetPayRunsPerMonthOverview;
  public grossSalaryForFinancialYear: IGrossSalaryByMonthlyFinancialYear;
  public chartPayByPayData: any;
  public chartPaybyPayOptions: any = {
    indexAxis: 'y',
    aspectRatio: 0.8,
    plugins: {
      legend: { display: false }
    }
  }
  public chartGrossPayOptions = {
    plugins: {}
  };
  public chartGrossPayData: any;

  constructor(
    injector: Injector) {
    super(injector);
    this.form = this.fb.group({
      fromDate: new FormControl(undefined),
      toDate: new FormControl(undefined)
    });
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate
    }
    this.store.dispatch(getTodoListWidgetDataAction());
    this.store.dispatch(getPayRunsPerMonthOverviewAction({ payload }));
    this.store.dispatch(getGrossSalariesByMonthForFinancialYearAction({ payload }));
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getGetPayRunsPerMonthOverviewSelector)),
      this.store.pipe(select(getGrossSalariesByMonthForFinancialYearSelector))
    ]).pipe(
      takeUntil(this.$unsubscribe))
      .subscribe(([payrunPerMOnth, grossSalariesForFinancialYear]) => {
        if (payrunPerMOnth) {
          this.payRunsPerMonthOverview = payrunPerMOnth;
          this.grossSalaryForFinancialYear = this.getGrossSalariesByDates(grossSalariesForFinancialYear, payrunPerMOnth.fromDate, payrunPerMOnth.toDate)[0];
          this.salaryData = this.getGrossSalariesByDates(grossSalariesForFinancialYear, payrunPerMOnth.fromDate, payrunPerMOnth.toDate)
            ?.map(gross => ({ name: moment(gross?.date).format('MMM yyyy'), value: gross?.grossAmount }))
          this.form.get('fromDate').patchValue(moment(payrunPerMOnth.fromDate).toDate());
          this.form.get('toDate').patchValue(moment(payrunPerMOnth.toDate).toDate());
          if (this.salaryData) {
            this.chartGrossPayData = {
              labels: this.salaryData?.map((value: any) => value?.name),
              datasets: [
                {
                  label: 'Gross',
                  data: this.salaryData?.map((value: any) => value?.value),
                  backgroundColor: CHARTCOLUMNBGCOLORS,
                  borderColor: CHARTBORDERCOLORS,
                  borderWidth: 1
                }
              ]
            };
          }
          if (this.grossSalaryForFinancialYear) {
            this.chartPayByPayData = {
              labels: [moment(this.grossSalaryForFinancialYear?.date).format('MMMM')],
              datasets: [
                {
                  backgroundColor: ['rgba(65, 197, 217, 0.5)'],
                  borderColor: '#218e8e',
                  data: [this.grossSalaryForFinancialYear?.grossAmount]
                },
                {
                  backgroundColor: 'rgba(120, 160, 249, 0.5)',
                  borderColor: '#477bf0',
                  data: [this.grossSalaryForFinancialYear?.netAmount]
                }
              ]
            };
          }
        }
      })
  }

  public isLoadingAsync = () => this.store.pipe(select(getPayrollLoadingSelector));

  public onFilter(): void {
    this.store.dispatch(getPayRunsPerMonthOverviewAction({
      payload: {
        fromDate: moment(this.form.value.fromDate).format('DD/MM/YYYY'),
        toDate: moment(this.form.value.toDate).format('DD/MM/YYYY')
      }
    }));
  }

  public onReset(): void {
    this.form.reset();
    this.store.dispatch(getPayRunsPerMonthOverviewAction({
      payload: { fromDate: null, toDate: null }
    }));
  }

  public gotoMetrics(): void {
    this.router.navigateByUrl('/payroll/metrics');
  }

  private getGrossSalariesByDates(data: IGrossSalaryByMonthlyFinancialYear[], fromDate: string, toDate: string): IGrossSalaryByMonthlyFinancialYear[] {
    return data.filter(value => {
      const isBetween = moment(value.date).startOf('day').isBetween(moment(fromDate).startOf('day'), moment(toDate).startOf('day'), null, '[]');
      if (isBetween)
        return value;
      else
        return 0;
    });
  }
}
