import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { BenefitCalculationType, BursariesScholarshipsType, InputType, LongServiceAwardType, MedicalCostsBeneficiaryType, PayrollBenefitType } from '../../payroll.enum';
import { GetTypes } from 'src/app/shared/util/types.util';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getCustomPaytypeSelector, getPayrollEmployeeSetupDataSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { IOptionItem } from 'src/app/models/generic.model';
import { IBeneficiary, IBenefitInput, ICustomPaytype, IPayrollEmployeeSetupData } from '../../payroll.model';
import { getSelectedPayrollInputSelector } from '../../store/payroll-input/payroll-input.selector';
import { saveBenefitInputAction } from '../../store/payroll-input/payroll-input.action';

@Component({
  selector: 'kp-payroll-employee-setup-payroll-benefits-dialog',
  templateUrl: './payroll-employee-setup-payroll-benefits-dialog.component.html'
})
export class PayrollEmployeeSetupPayrollBenefitsDialogComponent extends GenericPage implements OnInit {
  public isEdit: boolean = false;
  public benefitsModalTitle: string;
  public showBenefitsModal: boolean = false;
  public benefitInputSetupForm: FormGroup;
  public payrollBenefitType = PayrollBenefitType;
  public longServiceAwardOptions = GetTypes(LongServiceAwardType);
  public benefitCalculationOptions = GetTypes(BenefitCalculationType);
  public bursariesScholarshipsOptions = GetTypes(BursariesScholarshipsType);
  public medicalCostsBeneficiaryOptions = GetTypes(MedicalCostsBeneficiaryType);
  public benefitCalculationType = BenefitCalculationType;
  public contributionTypeOptions: IOptionItem[];
  public customPaytype: ICustomPaytype;
  public inputType = InputType;
  public beneficiaries: IBeneficiary[];
  public employeesWithInputType: any[]; //note: this was not used somewhere else, verify?
  public selectedPayrollInput: IBenefitInput;
  public employeeSetupData: IPayrollEmployeeSetupData;
  public taxablePercentageOptions: IOptionItem[];

  constructor(injector: Injector) {
    super(injector);
    this.benefitInputSetupForm = new FormGroup({
      benefitInputType: new FormControl(undefined),
      amount: new FormControl(undefined),
      benefitTaxablePercentage: new FormControl(undefined),
      companyCarIncludesMaintenancePlan: new FormControl(false),
      exemptPortion: new FormControl(undefined),
      bursariesScholarshipsType: new FormControl(undefined),
      disabledPerson: new FormControl(false),
      medicalCostsBeneficiaryType: new FormControl(undefined),
      customRate: new FormControl(undefined),
      longServiceAwardType: new FormControl(undefined),
      benefitCalculationType: new FormControl(undefined)
    });
    this.translateOptionLabels(this.longServiceAwardOptions,
      this.benefitCalculationOptions,
      this.bursariesScholarshipsOptions,
      this.medicalCostsBeneficiaryOptions)
    this.taxablePercentageOptions = [{
      label: '20%',
      value: 0
    }, {
      label: '80%',
      value: 1
    }, {
      label: '100%',
      value: 2
    }]
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getCustomPaytypeSelector)),
      this.store.pipe(select(getSelectedPayrollInputSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employeeSetupData, customPaytype, selectedPayrollInput]) => {
        this.customPaytype = customPaytype;
        this.employeeSetupData = employeeSetupData;
        this.selectedPayrollInput = selectedPayrollInput as IBenefitInput;
        if (this.selectedPayrollInput) {
          this.benefitInputSetupForm.patchValue({
            benefitInputType: this.selectedPayrollInput?.payrollBenefitType,
            amount: this.selectedPayrollInput?.amount,
            benefitTaxablePercentage: this.selectedPayrollInput?.benefitTaxablePercentage,
            companyCarIncludesMaintenancePlan: this.selectedPayrollInput?.companyCarIncludesMaintenancePlan,
            exemptPortion: this.selectedPayrollInput?.exemptPortion,
            bursariesScholarshipsType: this.selectedPayrollInput?.bursariesScholarshipsType,
            disabledPerson: this.selectedPayrollInput?.disabledPerson,
            medicalCostsBeneficiaryType: this.selectedPayrollInput?.medicalCostsBeneficiaryType,
            customRate: this.selectedPayrollInput?.customRate ?? 0,
            longServiceAwardType: this.selectedPayrollInput?.longServiceAwardType,
            benefitCalculationType: this.selectedPayrollInput?.benefitCalculationType
          });
        }
      })
  }

  public onSave(): void {
    if (this.benefitInputSetupForm.valid && this.employeeSetupData) {
      this.store.dispatch(saveBenefitInputAction({
        payload: Object.assign({}, this.benefitInputSetupForm.value, {
          id: this.selectedPayrollInput?.id ?? 0,
          employeeId: this.employeeSetupData?.employee?.id,
          payRunId: this.employeeSetupData?.payRun?.id
        })
      }));
      setTimeout(() => this.showBenefitsModal = false, 300);
    }
    else
      alert('Not Implemented!');
  }

  public get showAmountFields(): boolean {
    const benefitInputType = this.benefitInputSetupForm.get('benefitInputType').value;
    const amountTypes = [0, 1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; //note: what is this?
    return amountTypes.indexOf(benefitInputType) >= 0
      || (this.customPaytype?.inputType === InputType.AmountPerEmployee
        || this.customPaytype?.inputType === InputType.DifferentOnEveryPayslip
        || this.customPaytype?.inputType === InputType.OnceOffForSpecifiedPayslips);
  }

  public get showQuantityFields(): boolean {
    return this.customPaytype?.inputType === InputType.HourlyRateFactorHours
      || this.customPaytype?.inputType === InputType.CustomRateQuantity;
  }
}