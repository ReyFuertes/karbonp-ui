import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { combineLatest, debounceTime, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { ICountry, IOptionItem, IOrganizationalUnit, IPayPeriod, IPaymentMethod, IPaypoint } from 'src/app/models/generic.model';
import { AppState } from 'src/app/store';
import { IdentificationType } from '../../../people/people.model';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { GetTypes } from 'src/app/shared/util/types.util';
import { getCountriesSelector, getOrganizationalUnitsSelector, getPayPeriodsSelector, getPayPointsSelector, getPaymentMethodsSelector } from 'src/app/store/app.selector';
import { updatePeopleEmployeeAction } from '../../store/employee/employee.action';
import { getEmployeeDynamicFieldsSelector, isEmployeeLoadingSelector } from '../../store/employee/employee.selector';
import { IEmployeeDynamicFields } from '../../employee.model';

@Component({
  selector: 'kp-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent extends GenericFormControls implements OnInit {
  public avatarPath: string = '';
  public menus: IOptionItem[] = [{
    label: 'Basics',
    value: 'basics'
  }, {
    label: 'Bank Details',
    value: 'bank_account_details'
  }, {
    label: 'Residential Address',
    value: 'residential_address'
  }, {
    label: 'Postal Address',
    value: 'postal_address'
  }, {
    label: 'Biography',
    value: 'biography'
  }];
  public activeMenuOption: 'basics' | 'bank_account_details' | 'residential_address' | 'postal_address' | 'Biography' = 'basics';
  public selectedMenu: string = 'basics';
  public payPeriods: IOptionItem[] = [];
  public paymentMethods: IOptionItem[] = [];
  public payPoints: IOptionItem[] = [];
  public organizationalUnits: IOptionItem[];
  public countries: IOptionItem[] = [];
  public identificationTypes = GetTypes(IdentificationType);
  public employeeDynamicFields: IEmployeeDynamicFields;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef) {
    super();
    this.form = new FormGroup({
      basics: this.fb.group({}),
      bankAccountDetails: this.fb.group({}),
      residentialAddress: this.fb.group({}),
      postalAddress: this.fb.group({}),
      biography: this.fb.group({}),
      emergencyContacts: new FormArray([])
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayPeriodsSelector)),
      this.store.pipe(select(getPaymentMethodsSelector)),
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getOrganizationalUnitsSelector)),
      this.store.pipe(select(getCountriesSelector)),
      this.store.pipe(select(getEmployeeDynamicFieldsSelector))
    ]).pipe(debounceTime(300), takeUntil(this.$unsubscribe))
      .subscribe(([payPeriods, paymentMethods, payPoints, organizationalUnits, countries, employeeDynamicFields]) => {
        this.payPeriods = payPeriods.map((period: IPayPeriod) => ({ label: period.name, value: period.id }));
        this.paymentMethods = paymentMethods.map((method: IPaymentMethod) => ({ label: method.name, value: method.id }));
        this.payPoints = payPoints.map((point: IPaypoint) => ({ label: point.name, value: point.id }));
        this.organizationalUnits = organizationalUnits.map((unit: IOrganizationalUnit) => ({ label: unit.displayName, value: unit.id }));
        this.countries = countries.map((country: ICountry) => ({ label: country.name, value: country.id }));
        this.employeeDynamicFields = employeeDynamicFields;
        this.cd.detectChanges();
      });
  }

  public get getBasicsForm(): FormGroup {
    return <FormGroup>this.form.get('basics');
  }

  public get getBankDetailsForm(): FormGroup {
    return <FormGroup>this.form.get('bankAccountDetails');
  }

  public get getResidentialAddressForm(): FormGroup {
    return <FormGroup>this.form.get('residentialAddress');
  }

  public get getPostalAddressForm(): FormGroup {
    return <FormGroup>this.form.get('postalAddress');
  }

  public get getBiographyForm(): FormGroup {
    return <FormGroup>this.form.get('biography');
  }

  public onSaveChanges(): void {
    this.store.dispatch(updatePeopleEmployeeAction({
      payload: Object.assign({},
        this.getBasicsForm.value,
        this.getBankDetailsForm?.value,
        this.getResidentialAddressForm?.value,
        this.getPostalAddressForm?.value,
        this.getBiographyForm?.value,
        {
          dateOfBirth: moment(this.form.value?.dateOfBirth).format('DD/MM/YYYY'),
          dateOfAppointment: moment(this.form.value?.dateOfAppointment).format('DD/MM/YYYY'),
          dateOfSeniority: moment(this.form.value?.dateOfSeniority).format('DD/MM/YYYY'),
        })
    }));
    setTimeout(() => this.router.navigateByUrl('/people'), 3000);
  }

  public isLoadingAsync = () => this.store.pipe(select(isEmployeeLoadingSelector));

  public onCancel(): void {
    switch (this.activeMenuOption) {
      case 'basics':
        this.router.navigateByUrl('/employee/menu');
        break;
      default:
        break;
    }
  }

  public getCurrentMenu(menuItem: IOptionItem): boolean {
    return menuItem.value === this.activeMenuOption;
  }

  public gotoMenu(selectedMenu: any): void {
    this.activeMenuOption = selectedMenu.value;
  }
}
