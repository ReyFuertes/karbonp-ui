import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

import { IOptionItem } from 'src/app/models/generic.model';
import { GenericDestroy } from '../../generics/generic-destroy-page';

@Component({
  selector: 'kp-input-multiple-select-chip',
  templateUrl: './input-multiple-select-chip.component.html',
  styleUrls: ['./input-multiple-select-chip.component.scss']
})
export class InputMultipleSelectChipComponent extends GenericDestroy implements OnChanges {
  @Input() public styleClass: string = '';
  @Input() public isLoading: boolean = false;
  @Input() public options: IOptionItem[] = [];
  @Input() public placeholder: string = 'Type name, team or office';
  @Input() public selectedValues: IOptionItem[] = [];
  @Input() public overlayWidth: string = '250px';
  @Output() public inputTextChange = new EventEmitter<string>();
  @Output() public selectedValuesChange = new EventEmitter<IOptionItem[]>();
  @ViewChild("op") public op: OverlayPanel | undefined;
  @ViewChild('searchInput') searchInput: ElementRef;

  public hasResults: boolean = false;
  public inputValue: string = '';

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isLoading = changes['isLoading']?.currentValue;
    this.options = changes['options']?.currentValue;
    if (changes['selectedValues'])
      this.selectedValues = changes['selectedValues']?.currentValue;
  }

  public reset(): void {
    this.selectedValues = [];
    this.inputValue = '';
  }

  public selectOption(selectedOption: IOptionItem): void {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
    const match = this.selectedValues.some(selected => selected.value === selectedOption.value);
    if (!match) {
      this.selectedValues.push(selectedOption);
      this.inputValue = '';
      this.selectedValuesChange.emit(this.selectedValues);
    }
    this.op?.hide();
  }

  public onInput(event: any): void {
    const value: string = event.target?.value;
    if (value?.trim()?.length >= 2)
      this.inputTextChange.emit(value);
    setTimeout(() => {
      if (value?.length <= 2 || value?.length === 0)
        this.options = [];
      else
        this.op?.show(event);
    }, 300);
  }

  public onBlur(event: any): void {
    setTimeout(() => {
      this.op?.hide();
      event.target.value = '';
    }, 100);
  }

  public removeItem(value: IOptionItem): void {
    const index = this.selectedValues.indexOf(value);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
      this.selectedValuesChange.emit(this.selectedValues);
    }
  }
}
