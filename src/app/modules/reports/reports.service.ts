import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { FormState } from "src/app/models/generic.enum";
import { BaseService } from "src/app/services/base.service";

@Injectable({ providedIn: 'root' })
export class ReportTemplateService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'DetailedPayrollReportTemplates');
  }
}
@Injectable({ providedIn: 'root' })
export class ReportsService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'DetailedPayrollReport');
  }
}
@Injectable({ providedIn: 'root' })
export class ReportsStateService {
  private $state: BehaviorSubject<FormState> = new BehaviorSubject(undefined);

  public getState(): Observable<FormState> {
    return this.$state.asObservable();
  }

  public setState(value: FormState) {
    this.$state.next(value);
  }
}