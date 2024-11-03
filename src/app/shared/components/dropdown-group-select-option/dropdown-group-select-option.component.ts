import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ICompanyOptions } from 'src/app/models/options.model';

@Component({
  selector: 'kp-dropdown-group-select-option',
  templateUrl: './dropdown-group-select-option.component.html',
  styleUrls: ['./dropdown-group-select-option.component.scss']
})
export class DropdownGroupSelectOptionComponent implements OnChanges {
  @Input() public selectedItem: string | undefined;
  @Input() public companyOptions: ICompanyOptions[] = [];
  @Input() public styleClass: string = '';
  @Output() public dropdownChange = new EventEmitter<string>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedItem'])
      this.selectedItem = changes['selectedItem']?.currentValue;
  }

  public onChange(event: any): void {
    this.dropdownChange.emit(event);
  }
}
