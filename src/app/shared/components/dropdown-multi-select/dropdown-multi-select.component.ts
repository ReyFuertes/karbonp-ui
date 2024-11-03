import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';

import { IOptionItem } from 'src/app/models/generic.model';

@Component({
  selector: 'kp-dropdown-multi-select',
  templateUrl: './dropdown-multi-select.component.html',
  styleUrls: ['./dropdown-multi-select.component.scss']
})
export class DropdownMultiSelectComponent {
  @Input() public form: FormGroup;
  @Input() public options: IOptionItem[];
  @Input() public controlName: string;
  @Input() public label: string;
  @Input() public placeholder: string = 'Select';
  @Input() public maxSelectedLabels: number = 2;
  @Input() public selectionLimit: number = null;
  @Output() public changeEmitter = new EventEmitter<any>();
  @ViewChild('cmp', { static: true }) cmp: MultiSelect;

  constructor() { }

  public onResetAll(): void {
    this.form.get(this.controlName).patchValue([], { emitEvent: true });
    this.cmp._filterValue.set(undefined)
  }
}
