import { Directive, ElementRef, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Directive({ selector: '[kp-autoFocusField]' })
export class AutoFocusDirective implements OnInit {
  constructor(private el: ElementRef) { }

  public ngOnInit(): void {
    of(this.el)
      .pipe(
        map(elementRef => elementRef.nativeElement),
        filter(nativeElement => !!nativeElement),
        take(1)
      ).subscribe(input => input.focus())
  }
}
