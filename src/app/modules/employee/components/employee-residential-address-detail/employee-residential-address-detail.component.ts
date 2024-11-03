import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IDynamicFormField } from '../../employee.model';

@Component({
  selector: 'kp-employee-residential-address-detail',
  templateUrl: './employee-residential-address-detail.component.html',
  styleUrls: ['./employee-residential-address-detail.component.scss']
})
export class EmployeeResidentialAddressDetailComponent extends GenericFormControls {
  @Input() public fields: IDynamicFormField[];

  constructor() {
    super();
  }

  public get getResidentialAddressForm(): FormGroup {
    return <FormGroup>this.form.get('residentialAddress');
  }
}
