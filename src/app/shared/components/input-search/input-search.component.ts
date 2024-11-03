import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'kp-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss']
})
export class InputSearchComponent implements OnInit {
  @Input() public placeholder: string = 'Search';
  @Input() public value: string = '';
  @Input() public styleClass: 'default' | 'success' | 'red' | 'orange' = 'default';
  @Output() public inputChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    document.getElementById('input')?.addEventListener('focus', function () {
      document.getElementById('icon')?.setAttribute('class', 'pi pi-search focus');
    });

    document.getElementById('input')?.addEventListener('focusout', function () {
      document.getElementById('icon')?.setAttribute('class', 'pi pi-search');
    });
  }

  public onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.inputChange.emit(this.value);
  }

  public onClear(): void {
    this.value = '';
    this.inputChange.emit(this.value);
  }
}
