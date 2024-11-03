import { Component, Input, OnInit } from '@angular/core';

import { GenericFormControls } from '../../generics/form-control.generic';
import { IDynamicFormField } from 'src/app/modules/employee/employee.model';

@Component({
  selector: 'kp-dynamic-fields',
  templateUrl: './dynamic-fields.component.html',
  styleUrls: ['./dynamic-fields.component.scss']
})
export class DynamicFieldsComponent extends GenericFormControls implements OnInit {
  @Input() public fields: IDynamicFormField[];

  public groupFields: {
    groupName: string, fields: any
  }[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.groupFields = Object.entries(
      this.fields?.reduce((acc: any, { name, type, required, groupName, options, value }) => {
        const _groupName = groupName ?? 'none';
        if (!acc[_groupName]) {
          acc[_groupName] = [];
        }
        acc[_groupName].push({
          name, type, options, required, value
        });
        return acc;
      }, {})
    ).map(([groupName, fields]) => ({ groupName, fields }));
  }
}
