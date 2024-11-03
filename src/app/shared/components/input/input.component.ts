import { Component } from '@angular/core';

import { GenericFormControls } from '../../generics/form-control.generic';

@Component({
  selector: 'kp-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent extends GenericFormControls {
  constructor() {
    super();
  }
}
