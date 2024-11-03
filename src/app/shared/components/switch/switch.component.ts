import { Component } from '@angular/core';

import { GenericFormControls } from '../../generics/form-control.generic';

@Component({
  selector: 'kp-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent extends GenericFormControls {
  constructor() {
    super();
  }

  public onChange(event: any): void {
    if (event?.checked === false)
      this.form.get(this.controlName).setErrors({ 'required': true });
  }
}