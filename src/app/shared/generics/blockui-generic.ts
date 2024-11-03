import { Directive, ElementRef, HostListener } from '@angular/core';

import { BlockUIService } from 'src/app/services/blockui.service';
import { GenericDestroy } from './generic-destroy-page';

@Directive()
export class GenericBlockUI extends GenericDestroy {
  constructor(public blockUIService: BlockUIService, private elementRef: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: PointerEvent) {
    const nativeElement: any = this.elementRef.nativeElement;
    const clickedInside: boolean = nativeElement.contains(event.target);
    this.blockUIService.setBlockUI(clickedInside);
  }
}
