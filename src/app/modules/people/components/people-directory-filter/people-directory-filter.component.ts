import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { IOptionItem } from 'src/app/models/generic.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { EmploymentType, IPeopleStatus } from '../../people.model';
import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';

@Component({
  selector: 'kp-people-directory-filter',
  templateUrl: './people-directory-filter.component.html',
  styleUrls: ['./people-directory-filter.component.scss']
})
export class PeopleDirectoryFilterComponent extends GenericDestroy implements OnChanges {
  @Input() public statuses: IPeopleStatus[];
  @Output() public filterStatusChange = new EventEmitter<number[]>();
  @Output() public allFilterChange = new EventEmitter<boolean>();

  public isStatusSelectAll: boolean = false;
  public checkedStatuses: number[];
  public getEmployementType = GetTypes(EmploymentType);
  public filterByTeams: IOptionItem[] = [{
    label: '1',
    value: ''
  }, {
    label: 'Development',
    value: ''
  }, {
    label: '3',
    value: ''
  }, {
    label: '5',
    value: ''
  }, {
    label: 'QA',
    value: ''
  }, {
    label: '2',
    value: ''
  }, {
    label: 'Test',
    value: ''
  }, {
    label: 'No Team',
    value: ''
  }];
  public filterByOffices: IOptionItem[] = [{
    label: 'Mexico City',
    value: ''
  }, {
    label: 'Harare',
    value: ''
  }, {
    label: 'Dallas',
    value: ''
  }, {
    label: 'Cape Town',
    value: ''
  }, {
    label: 'No Office',
    value: ''
  }];

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statuses'])
      this.statuses = changes['statuses'].currentValue;
  }

  public onCheckAll(name: string): void {
    switch (name) {
      case 'status':
        if (!this.isStatusSelectAll) {
          this.checkedStatuses = this.statuses?.map(status => status.id);
        } else
          this.checkedStatuses = [];
        this.isStatusSelectAll = !this.isStatusSelectAll
        if (this.statuses?.length === this.checkedStatuses.length)
          this.isStatusSelectAll = true;
        else
          this.isStatusSelectAll = false;
        this.allFilterChange.emit(this.isStatusSelectAll);
        break;
      default:
        break;
    }
  }
}
