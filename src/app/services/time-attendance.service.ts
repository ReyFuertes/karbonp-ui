import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class TimeAndAttendanceService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'TimeAndAttendance');
  }
}