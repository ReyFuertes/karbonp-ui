import { Component, ElementRef, Input } from '@angular/core';
import { BlockableUI } from 'primeng/api';

@Component({
  selector: 'kp-blockable',
  template: `<div [ngStyle]="style" [ngClass]="class" ><ng-content></ng-content></div>`
})
export class BlockableComponent implements BlockableUI {
  @Input() public style: any;
  @Input() public class: any;

  constructor(private el: ElementRef) { }

  public getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0];
  }
}