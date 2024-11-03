import { Component } from '@angular/core';

import { GenericFormControls } from '../../generics/form-control.generic';

@Component({
  selector: 'kp-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent extends GenericFormControls {
  constructor() {
    super();
  }
}
