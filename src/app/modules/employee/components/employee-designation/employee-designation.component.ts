import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { AppState } from 'src/app/store';
import { IAvailableExchangeRate, IDesignation, IOptionItem, PaymentType } from 'src/app/models/generic.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { getAvailableExchangeRatesSelector } from 'src/app/store/app.selector';
import { EmploymentType } from '../../../people/people.model';
import { getPeopleEmployeeClassificationSelector, getPeopleEmployeeIdSelector, getSelectedEmployeeCalcDailyWageSelector } from '../../store/employee/employee.selector';
import { updatePeopleEmployeeClassificationAction } from '../../store/employee/employee.action';


@Component({
  selector: 'kp-employee-designation',
  templateUrl: './employee-designation.component.html',
  styleUrls: ['./employee-designation.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeDesignationComponent extends GenericDestroy implements OnInit {
  @Output() public savedFormChanges = new EventEmitter<boolean>();

  public form: FormGroup;
  public actionState: 'view' | 'edit' = 'view';
  public currentSection: 'designation' | '' = '';
  public employeeClassification: IDesignation;
  public paymentTypes = GetTypes(PaymentType);
  public exchangeRates: IOptionItem[];
  public employementTypes = GetTypes(EmploymentType);
  public calcDailyWage: number = 0;
  public isLoaded: boolean = false;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder
  ) {
    super();
    this.form = new FormGroup({
      employeeId: new FormControl(undefined),
      paymentType: new FormControl(undefined),
      paymentAmount: new FormControl(undefined),
      paymentAmountCurrency: new FormControl(undefined),
      employmentType: new FormControl(undefined),
      isManagerOrSupervisor: new FormControl(undefined),
      excludeFromGovernmentContributions: new FormControl(undefined),
      exemptFromTax: new FormControl(undefined)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPeopleEmployeeIdSelector)),
      this.store.pipe(select(getPeopleEmployeeClassificationSelector)),
      this.store.pipe(select(getAvailableExchangeRatesSelector)),
      this.store.pipe(select(getSelectedEmployeeCalcDailyWageSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employeeId, employeeClassification, exchangeRates, calcDailyWage]) => {
        if (employeeClassification) {
          this.isLoaded = true;
          this.employeeClassification = employeeClassification;
          this.exchangeRates = exchangeRates.map((currency: IAvailableExchangeRate) => ({
            imageUrl: currency.fromCurrencyFlagPath,
            label: currency.fromCurrency,
            value: currency.id
          }));
          this.calcDailyWage = calcDailyWage;
          this.form.reset();
          this.form.patchValue({
            employeeId,
            paymentType: this.employeeClassification?.paymentType,
            paymentAmount: this.employeeClassification?.paymentAmount,
            paymentAmountCurrency: this.employeeClassification?.paymentAmountCurrency,
            employmentType: this.employeeClassification?.employmentType,
            isManagerOrSupervisor: this.employeeClassification?.isManagerOrSupervisor,
            excludeFromGovernmentContributions: this.employeeClassification?.excludeFromGovernmentContributions,
            exemptFromTax: this.employeeClassification?.exemptFromTax,
          }, { emitEvent: true });
        }
      });
  }

  public onSaveChanges(): void {
    if (this.form.valid) {
      this.store.dispatch(updatePeopleEmployeeClassificationAction({
        payload: this.form.value
      }));
      setTimeout(() => {
        this.savedFormChanges.emit(true);
        this.onCancel('designation');
      }, 1000);
    }
  }

  public onCancel(section: any): void {
    this.actionState = 'view';
    this.currentSection = section;
  }

  public onEdit(section: any): void {
    this.actionState = 'edit';
    this.currentSection = section;
  }

  public get getExemptFromTax(): boolean {
    return this.employeeClassification?.exemptFromTax === true;
  }

  public get getExcludeFromGovernmentContributions(): boolean {
    return this.employeeClassification?.excludeFromGovernmentContributions === true;
  }

  public get getIsManagerOrSupervisor(): boolean {
    return this.employeeClassification?.isManagerOrSupervisor === true;
  }

  public get getExchangeRates(): IOptionItem[] {
    return this.exchangeRates
  }

  public get getEmployeeEmploymentType(): IOptionItem {
    return this.employementTypes?.find(type => type.value === this.employeeClassification?.employmentType);
  }

  public get getEmployeeCurrency(): IOptionItem {
    return this.exchangeRates?.find(rate => rate.value === this.employeeClassification?.paymentAmountCurrency)
  }

  public get getTypeByLabel(): string {
    return this.paymentTypes?.find(type => type.value === this.employeeClassification?.paymentType)?.label;
  }
}
