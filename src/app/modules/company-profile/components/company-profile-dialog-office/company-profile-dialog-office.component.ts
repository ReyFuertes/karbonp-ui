import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'kp-company-profile-dialog-office',
  templateUrl: './company-profile-dialog-office.component.html',
  styleUrls: ['./company-profile-dialog-office.component.scss']
})
export class CompanyProfileDialogOfficeComponent {
  @Input() public showModal: boolean = false;
  @Output() public modalChange = new EventEmitter<boolean>(false);
  
  constructor() { }

  public onAddEveryone(): void {
    console.log('Not Implemented');
  }
}
