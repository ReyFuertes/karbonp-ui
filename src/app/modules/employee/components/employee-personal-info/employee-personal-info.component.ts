import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { combineLatest, filter, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { ICountry, IOptionItem, IOrganizationalUnit, IPayPeriod, IPaymentMethod, IPaypoint } from 'src/app/models/generic.model';
import { getCountriesSelector, getOrganizationalUnitsSelector, getPayPeriodsSelector, getPayPointsSelector, getPaymentMethodsSelector } from 'src/app/store/app.selector';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IdentificationType } from '../../../people/people.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { AppState } from 'src/app/store';
import { IDynamicFormField, IEmployee, IEmployeeDynamicFields } from '../../employee.model';
import { getEmployeeDynamicFieldsSelector, getSelectedEmployeeSelector, isEmployeeLoadingSelector } from '../../store/employee/employee.selector';
import { updatePeopleEmployeeAction } from '../../store/employee/employee.action';
import { LocalService } from 'src/app/services/local-storage.service';
import { employeeToForm } from 'src/app/shared/util/formatting';

@Component({
  selector: 'kp-employee-personal-info',
  templateUrl: './employee-personal-info.component.html',
  styleUrls: ['./employee-personal-info.component.scss']
})
export class EmployeePersonalInfoComponent extends GenericFormControls implements OnInit, AfterViewInit {
  @Output() public savedFormChanges = new EventEmitter<boolean>();
  @ViewChild('basicInputFocus') basicInputFocus: ElementRef;
  @ViewChild('bioTextAreaFocus') bioTextAreaFocus: ElementRef;
  @ViewChild('badInputFocus') badInputFocus: ElementRef;
  @ViewChild('radInputFocus') radInputFocus: ElementRef;
  @ViewChild('padInputFocus') padInputFocus: ElementRef;
  @ViewChild("cd") public cd: ConfirmDialog | undefined;

  public identificationTypes = GetTypes(IdentificationType);
  public payPeriods: IOptionItem[];
  public paymentMethods: IOptionItem[] = [];
  public payPoints: IOptionItem[] = [];
  public organizationalUnits: IOptionItem[];
  public actionState: 'view' | 'edit' = 'edit';
  public currentSection: 'basic' | 'bankAccountDetails' | 'residentialAddress' | 'postalAddress' | 'biography' | 'emergencyContacts' | string = '';
  public countries: IOptionItem[] = [];
  public showDialog: boolean = false;
  public employeeDynamicFields: IEmployeeDynamicFields;
  public bioTranslateParam: { [key: string]: string };

  private employeeToForm = employeeToForm;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private localService: LocalService,
    private cdRef: ChangeDetectorRef
  ) {
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
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getPayPeriodsSelector)),
      this.store.pipe(select(getPaymentMethodsSelector)),
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getOrganizationalUnitsSelector)),
      this.store.pipe(select(getCountriesSelector)),
      this.store.pipe(select(getEmployeeDynamicFieldsSelector))
    ]).pipe(
      filter(response => !!response[0]),
      takeUntil(this.$unsubscribe)
    ).subscribe({
      next: ([employee, payPeriods, paymentMethods, payPoints, organizationalUnits, countries, employeeDynamicFields]) => {
        this.payPeriods = payPeriods.map((period: IPayPeriod) => ({ label: period.name, value: period.id }));
        this.paymentMethods = paymentMethods.map((method: IPaymentMethod) => ({ label: method.name, value: method.id }));
        this.payPoints = payPoints.map((point: IPaypoint) => ({ label: point.name, value: point.id }));
        this.organizationalUnits = organizationalUnits.map((unit: IOrganizationalUnit) => ({ label: unit.displayName, value: unit.id }));
        this.countries = countries.map((country: ICountry) => ({ label: country.name, value: country.id }));
        setTimeout(() => this.basicInputFocus?.nativeElement.focus(), 350);
        this.bioTranslateParam = {
          firstName: this.form.get('basics').value?.firstName || '',
          CompanyName: this.localService.getEncItem('companyName')
            ? JSON.parse(this.localService.getEncItem('companyName'))
            : 'YourCompanyName'
        };
        this.employeeDynamicFields = employeeDynamicFields;
        if(this.employeeDynamicFields) {
          Object.entries(this.employeeDynamicFields)?.forEach(([key, values]) => {
            const formElement = (this.form.get(key) as FormGroup);
            if (formElement)
              values?.forEach((control: IDynamicFormField) => {
                if (control?.name) {
                  formElement.addControl(control.name, new FormControl(control?.value,
                    control?.required
                      ? <Validators>this.controlValidators(control.type)
                      : []))
                }
              })
          });
        }
        if (employee)
          this.formatToForm(employee);
      }
    });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  public isLoadingAsync = () => this.store.pipe(select(isEmployeeLoadingSelector));

  public getCountryName(id: number): string {
    return this.countries.find(country => country.value === id)?.label;
  }

  public get getEmergencyContacts(): FormArray {
    return this.form.get("emergencyContacts") as FormArray;
  }

  private formatToForm(employee: IEmployee): void {
    if (employee)
      this.form.patchValue(this.employeeToForm(employee), { emitEvent: true });
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
    if (this.form.valid) {
      this.store.dispatch(updatePeopleEmployeeAction({
        payload: Object.assign({},
          this.getBasicsForm.value,
          this.getBankDetailsForm.value,
          this.getResidentialAddressForm.value,
          this.getPostalAddressForm.value,
          this.getBiographyForm.value,
          {
            dateOfBirth: moment(this.form.value?.dateOfBirth).format('DD/MM/YYYY'),
            dateOfAppointment: moment(this.form.value?.dateOfAppointment).format('DD/MM/YYYY'),
            dateOfSeniority: moment(this.form.value?.dateOfSeniority).format('DD/MM/YYYY'),
          })
      }));
      setTimeout(() => {
        this.savedFormChanges.emit(true);
      }, 3000);
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
}
