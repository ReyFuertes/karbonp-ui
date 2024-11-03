import { Component } from '@angular/core';
import { IOptionItem } from 'src/app/models/generic.model';

@Component({
  selector: 'kp-people-custom-fields',
  templateUrl: './people-custom-fields.component.html',
  styleUrls: ['./people-custom-fields.component.scss']
})
export class PeopleCustomFieldsComponent {
  public isEditCustomField: boolean = false;
  public customFieldTypes: IOptionItem[] = [{
    label: 'Single-line text',
    value: ''
  }, {
    label: 'Multi-line text',
    value: ''
  }, {
    label: 'Dropdown',
    value: ''
  }];
  public selectedEmployeeFlow: string = '1';
  public selectedEditEmployeeProfile: string = '4';
  public selectedEditEmployeeField: string = '6';
  public selectedEditEmployeeManager: string = '8';
  public newCustomFields: IOptionItem[] = [];
  public autoResize: boolean = true;
  
  constructor() { }

  public onAddCustomerField(): void {
    this.newCustomFields.push(Object.assign({}));
  }

  public onRemoveCustomField(i: number): void {
    this.newCustomFields.splice(i, 1);
  }
}
