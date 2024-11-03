import { Component, Injector, OnInit } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';
import { FormControl, Validators } from '@angular/forms';

import { getDownloadedGoalGetterPaySlipPdfSelector, getGoalGetterSelector, getPayrollEmployeeSetupDataSelector, getPayrollPayrunInProgressLoadingSelector, getPayrollPayslipPreviewDataSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { applyGoalGetterNetAmountAction, calculateGoalGetterNetAmountAction, generateGoalGetterPaySlipPDFAction } from '../../store/payrun-in-progress/payroll-payrun-in-progress.action';
import { IOptionItem } from 'src/app/models/generic.model';
import { ICalculatedGoalGetter, IPayrollEmployeeSetupData, IPayslipPreview } from '../../payroll.model';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';

@Component({
  selector: 'kp-payroll-employee-setup-payroll-goal-getter-dialog',
  templateUrl: './payroll-employee-setup-payroll-goal-getter-dialog.component.html',
  styleUrls: ['./payroll-employee-setup-payroll-goal-getter-dialog.component.scss']
})
export class PayrollEmployeeSetupPayrollGoalGetterDialogComponent extends GenericPage implements OnInit {
  public showGoalGetterModal: boolean;
  public goalGetterOptions: IOptionItem[];
  public payslipPreview: IPayslipPreview;
  public payrollEmployeeSetupData: IPayrollEmployeeSetupData;
  public calculatedGoalGetter: ICalculatedGoalGetter;
  public downloadedGoalGetterPaySlipPdf = new Map<number, any>(); //note: no proper model

  constructor(injector: Injector) {
    super(injector);
    this.form = this.fb.group({
      goalNetAmount: new FormControl(undefined, Validators.required),
      goalGetterType: new FormControl(undefined, Validators.required),
      payslipId: new FormControl(undefined, Validators.required)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getGoalGetterSelector)),
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getPayrollPayslipPreviewDataSelector)),
      this.store.pipe(select(getDownloadedGoalGetterPaySlipPdfSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([calculatedGoalGetter, payrollEmployeeSetupData, payslipPreview, downloadedGoalGetterPaySlipPdf]) => {
        this.calculatedGoalGetter = calculatedGoalGetter;
        this.payrollEmployeeSetupData = payrollEmployeeSetupData;
        const _payslipPreview = Object.assign({}, payslipPreview)
        if (_payslipPreview) {
          this.payslipPreview = Object.assign(_payslipPreview, {
            payslip: calculatedGoalGetter?.payslip
          });
        }
        this.downloadedGoalGetterPaySlipPdf = downloadedGoalGetterPaySlipPdf;
        if (this.downloadedGoalGetterPaySlipPdf) {
          const downloadedPayslip = this.downloadedGoalGetterPaySlipPdf?.get(this.calculatedGoalGetter?.payslip?.id);
          if (downloadedPayslip) {
            try {
              processPayrunDownload(downloadedPayslip?.data, this.getPayslipFileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
        this.form.setErrors(null);
      });
  }

  public onApply(): void {
    if (this.form.valid) {
      this.store.dispatch(applyGoalGetterNetAmountAction({
        payload: this.form.value,
        employeeId: this.payrollEmployeeSetupData?.employee?.id,
        payRunId: this.payrollEmployeeSetupData.payRun?.id
      }));
      setTimeout(() => this.showGoalGetterModal = false, 300);
    }
    else
      console.log('Error: Invalid form');
  }

  public generateGoalGetterPaySlipPDF(): void {
    const payslipId = this.calculatedGoalGetter?.payslip?.id;
    const downloadedPayslip = this.downloadedGoalGetterPaySlipPdf?.get(payslipId);
    if (downloadedPayslip) {
      try {
        processPayrunDownload(downloadedPayslip?.data, this.getPayslipFileName);   
      } catch (error) {
        this.showError(error as string);
      }
    }
    else {
      if (this.form.valid)
        this.store.dispatch(generateGoalGetterPaySlipPDFAction({ payload: this.form.value }));
    }
  }

  public reset(): void {
    this.calculatedGoalGetter = undefined;
    this.payrollEmployeeSetupData = undefined;
  }

  public isLoadingAsync = () => this.store.pipe(select(getPayrollPayrunInProgressLoadingSelector));

  public onCalculate(): void {
    if (this.form.valid) {
      this.store.dispatch(calculateGoalGetterNetAmountAction({
        payload: this.form.value
      }));
      this.form.setErrors({ invalid: true });
    }
  }

  private get getPayslipFileName(): string {
    const date = new Date(this.payrollEmployeeSetupData?.payRun?.payDate ?? this.payrollEmployeeSetupData?.payRun?.toDate);
    return 'Draft_' + this.payrollEmployeeSetupData?.employee?.firstName.substring(0, 1)
      + '_' + this.payrollEmployeeSetupData?.employee?.lastName.replace(' ', '')
      + '_' + date.toLocaleString('default', { month: 'short' })
      + '_' + date.getDate()
      + '_' + date.getFullYear().toString() + '.pdf';
  }
}
