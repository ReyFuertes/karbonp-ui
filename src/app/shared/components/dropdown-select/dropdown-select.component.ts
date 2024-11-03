import { Component, } from '@angular/core';

import { GenericFormControls } from '../../generics/form-control.generic';
import { IOptionItem } from 'src/app/models/generic.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kp-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss']
})
export class DropdownSelectComponent extends GenericFormControls {
  constructor(private translateService: TranslateService) {
    super();
  }

  public get getTranslatedOptions(): IOptionItem[] {
    return this.field?.options?.map(option => {
      return {
        label: this.translateService.instant(option?.label),
        value: option?.value
      }
    })
  }
}
