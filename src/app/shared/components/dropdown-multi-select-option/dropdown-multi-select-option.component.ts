import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { IOptionItem } from 'src/app/models/generic.model';

@Component({
  selector: 'kp-dropdown-multi-select-option',
  templateUrl: './dropdown-multi-select-option.component.html',
  styleUrls: ['./dropdown-multi-select-option.component.scss']
})
export class DropdownMultiSelectOptionComponent {
  @Input() public label: string = '';
  @Input() public options: IOptionItem[] = [];
  @Input() public class: string = '';
  
  public expandOptions: boolean = false;
  public selectedValues: string[] = [];

  constructor(private elementRef: ElementRef) { }

  public onExpand(op: any, event: any): void {
    op.toggle(event);
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: any) {
    const nativeElement: any = this.elementRef.nativeElement;
    const clickedInside = nativeElement.contains(event.target);
    if (event.target.classList.contains('p-element') || event.target.classList.contains('p-checkbox-box')) {
      this.expandOptions === false;
      return;
    }
    this.expandOptions = clickedInside;
  }
}
