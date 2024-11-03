import { Directive } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { GenericDestroy } from './generic-destroy-page';
import { IDynamicFormField } from 'src/app/modules/employee/employee.model';

@Directive()
export class FormValidators extends GenericDestroy {
  protected dynamicForm: FormGroup;

  constructor() {
    super();
  }

  protected registerFormControl(field: IDynamicFormField): FormControl {
    return this.dynamicForm.registerControl(field.name, field.required
      ? new FormControl(field.value || '', <Validators>this.controlValidators(field.type))
      : new FormControl(field.value || '')) as FormControl;
  }

  protected isRequired(formName: string, form?: AbstractControl | null): boolean | null | undefined {
    return (this.dynamicForm ?? form)?.get(formName)?.errors?.['required']
      && (this.dynamicForm ?? form)?.get(formName)?.touched;
  }

  protected isValid(formName: string, form?: AbstractControl | null): boolean | null | undefined {
    return (this.dynamicForm ?? form)?.get(formName)?.errors?.['email']
      && (this.dynamicForm ?? form)?.get(formName)?.touched;
  }

  private controlValidators(type: string): Validators[] {
    const validators: ValidationErrors[] = [];
    if (type === 'text')
      validators.push(Validators.required);
    if (type === 'email')
      validators.push(...[Validators.required, Validators.email]);
    return validators;
  }
}
