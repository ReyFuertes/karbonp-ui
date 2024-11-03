import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { GenericDestroy } from './generic-destroy-page';
import { IDynamicFormField } from 'src/app/modules/employee/employee.model';
import { IOptionItem } from 'src/app/models/generic.model';

@Directive()
export class GenericFormControls extends GenericDestroy implements OnChanges {
  @Input() public controlName: string;
  @Input() public required: boolean = false;
  @Input() public value: string | number | boolean;
  @Input() public options: IOptionItem[] = [];
  @Input() public form: FormGroup;
  @Input() public type: 'text' | 'email' | 'dropdown' | 'switch' | 'date' | 'hidden' | 'editor';

  protected field: IDynamicFormField;

  constructor() {
    super();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.controlName = changes['controlName']?.currentValue;
    this.required = changes['required']?.currentValue;
    this.value = changes['value']?.currentValue;
    this.form = changes['form']?.currentValue;
    this.type = changes['type']?.currentValue;
    this.options = changes['options']?.currentValue;

    this.buildControl();
  }

  public registerFormControl(field: IDynamicFormField): FormControl {
    return this.form?.registerControl(field?.name, field?.required
      ? new FormControl(field?.value, <Validators>this.controlValidators(field?.type))
      : new FormControl(field?.value)) as FormControl;
  }

  private buildControl(): void {
    this.field = {
      type: this.type,
      name: this.controlName,
      required: this.required,
      value: this.value,
      options: this.options
    }
  }

  protected getRequiredValidation(formName: string, form?: AbstractControl | null): boolean | null | undefined {
    return (this.form ?? form)?.get(formName)?.errors?.['required']
      && (this.form ?? form)?.get(formName)?.touched;
  }

  protected getEmailValidation(formName: string, form?: AbstractControl | null): boolean | null | undefined {
    return (this.form ?? form)?.get(formName)?.errors?.['email']
      && (this.form ?? form)?.get(formName)?.touched;
  }

  protected controlValidators(type: string): Validators[] {
    const validators: ValidationErrors[] = [];
    if (type === 'text' || type === 'dropdown' || type === 'switch' || type === 'date' || type === 'hidden')
      validators.push(Validators.required);
    if (type === 'email')
      validators.push(...[Validators.required, Validators.email]);
    return validators || null;
  }
}
