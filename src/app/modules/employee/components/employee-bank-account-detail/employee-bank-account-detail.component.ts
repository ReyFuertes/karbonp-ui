import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IDynamicFormField } from '../../employee.model';

@Component({
  selector: 'kp-employee-bank-account-detail',
  templateUrl: './employee-bank-account-detail.component.html',
  styleUrls: ['./employee-bank-account-detail.component.scss']
})
export class EmployeeBankAccountDetailComponent extends GenericFormControls {
  @Input() public fields: IDynamicFormField[];

  constructor() {
    super();
  }

  public get getBankDetailsForm(): FormGroup {
    return <FormGroup>this.form.get('bankAccountDetails');
  }
}
