
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { Injectable } from '@angular/core';

import { IEmployee } from './employee.model';


@Injectable({ providedIn: 'root' })
export class DynamicFieldService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'DynamicField');
  }
}

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'Employee');
  }
}

@Injectable({ providedIn: 'root' })
export class EmployeeAccountStatusService extends BaseService<IEmployee> {
  constructor(http: HttpClient) {
    super(http, 'EmployeeAccountStatus');
  }
}
