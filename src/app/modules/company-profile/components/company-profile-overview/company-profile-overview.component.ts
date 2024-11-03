import { Component } from '@angular/core';
import { IOptionItem } from 'src/app/models/generic.model';

@Component({
  selector: 'kp-company-profile-overview',
  templateUrl: './company-profile-overview.component.html',
  styleUrls: ['./company-profile-overview.component.scss']
})
export class CompanyProfileOverviewComponent {
  public isEditIntro: boolean = false;
  public isEditNote: boolean = false;
  public selectedNoteIndex: number;
  public selectedOfficeIndex: number;
  public offices: IOptionItem[] = [
    { label: 'Cape Town', value: '' },
    { label: 'Dallas', value: '' },
    { label: 'Harare', value: '' },
    { label: 'Mexico City', value: '' },
  ];
  public notes: IOptionItem[] = [
    { label: 'Gate password: 1234', value: '' }
  ];
  public people: IOptionItem[] = [
    { label: 'SS', value: '' },
    { label: 'RF', value: '' },
    { label: 'LL', value: '' },
    { label: 'DA', value: '' },
    { label: 'KR', value: '' }
  ];
  public showAddOfficeModal: boolean = false;
  public isEditCompanyNumber: boolean = false;
  public isEditCompanyVatNumber: boolean = false;
  public showRegEditAddressModal: boolean = false;

  constructor() { }

  public onEditNote(): void {
    this.isEditNote = !this.isEditNote;
  }

  public onEditIntro(): void {
    this.isEditIntro = !this.isEditIntro;
  }
}
