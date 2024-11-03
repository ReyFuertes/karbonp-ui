import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Iteam } from 'src/app/models/people.model';

@Component({
  selector: 'kp-people-teams',
  templateUrl: './people-teams.component.html',
  styleUrls: ['./people-teams.component.scss']
})
export class PeopleTeamsComponent {
  @ViewChild('op') public op: any;
  @ViewChild('overlayAddTarget') public overlayAddTarget: ElementRef;
  @ViewChild('overlayEditTarget') public overlayEditTarget: ElementRef;

  public isOverlayShowing: boolean = false;
  public teams: Iteam[] = [{
    name: '1',
    description: '',
    count: 2
  }, {
    name: '2',
    description: '',
    count: 2
  }, {
    name: '3',
    description: '',
    count: 2
  }, {
    name: '4',
    description: '',
    count: 2
  }, {
    name: 'Development',
    description: '',
    count: 2
  }, {
    name: 'QA',
    description: 'QA team',
    count: 2
  }, {
    name: 'TEST',
    description: '',
    count: 2
  }];
  public selectedRow: number;

  constructor(private elementRef: ElementRef) { }

  public onAdd(op: any, event: any): void {
    op.show(event, this.overlayAddTarget.nativeElement);
    this.isOverlayShowing = !this.isOverlayShowing;
  }

  public onEdit(op: any, event: any): void {
    op.show(event, this.overlayEditTarget.nativeElement);
    this.isOverlayShowing = !this.isOverlayShowing;
  }

  public onClose(): void {
    this.op.hide();
  }

  public onMouseover(index: number): void {
    this.isOverlayShowing === false
      ? this.selectedRow = index
      : null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    const nativeElement: any = this.elementRef.nativeElement;
    const clickedInside: boolean = nativeElement.contains(event.target);
    const excludedClasses = ['p-inputtext', 'form-input-field', 'noselect', ''];
    const includedClasses = ['team-row'];
    if ([...event.target.classList].some((className: any) => excludedClasses.includes(className)))
      return;
    if (clickedInside === false || [...event.target.classList].some((className: any) => includedClasses.includes(className))) {
      this.isOverlayShowing = false;
      setTimeout(() => { this.selectedRow = -1 }, 20);
    }
  }
}
