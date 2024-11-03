import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IDynamicFormField } from '../../employee.model';

@Component({
  selector: 'kp-employee-postal-address-detail',
  templateUrl: './employee-postal-address-detail.component.html',
  styleUrls: ['./employee-postal-address-detail.component.scss']
})
export class EmployeePostalAddressComponent extends GenericFormControls {
  @Input() public fields: IDynamicFormField[];

  constructor() {
    super();
  }

  public get getPostalAddressForm(): FormGroup {
    return <FormGroup>this.form.get('postalAddress');
  }
}
