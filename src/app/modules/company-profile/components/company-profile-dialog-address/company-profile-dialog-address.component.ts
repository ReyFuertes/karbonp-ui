import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IOptionItem } from 'src/app/models/generic.model';

@Component({
  selector: 'kp-company-profile-dialog-address',
  templateUrl: './company-profile-dialog-address.component.html',
  styleUrls: ['./company-profile-dialog-address.component.scss']
})
export class CompanyProfileDialogAddressComponent {
  @Input() public showModal: boolean = false;
  @Output() public modalChange = new EventEmitter<boolean>(false);

  public countries: IOptionItem[] = [{
    label: 'Philippines',
    value: 'PH'
  }, {
    label: 'Australia',
    value: 'AU'
  }];
  constructor() { }
}
