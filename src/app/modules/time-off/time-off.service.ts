import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/services/base.service";

@Injectable({ providedIn: 'root' })
export class TimeOffBulkImportService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'BulkImport');
  }
}
@Injectable({ providedIn: 'root' })
export class TimeOffService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'TimeOffBooking');
  }
}