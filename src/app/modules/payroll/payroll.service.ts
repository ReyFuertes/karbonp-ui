import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BaseService } from "src/app/services/base.service";

@Injectable({ providedIn: 'root' })
export class PayRunPaymentService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'PayRunPayment');
  }
}
@Injectable({ providedIn: 'root' })
export class TradeclassificationsService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'tradeclassification');
  }
}
@Injectable({ providedIn: 'root' })
export class TradeclassificationgroupService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'tradeclassificationgroup');
  }
}
@Injectable({ providedIn: 'root' })
export class StandardIndustrialClassificationService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'standardindustrialclassifications');
  }
}
@Injectable({ providedIn: 'root' })
export class AnnualizationReportService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'AnnualizationReport');
  }
}
@Injectable({ providedIn: 'root' })
export class FilingDetailsSetupService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'filingdetailssetup');
  }
}
@Injectable({ providedIn: 'root' })
export class PhilippinesSubmissionsService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'PhilippinesSubmissions');
  }
}
@Injectable({ providedIn: 'root' })
export class TaxService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'tax');
  }
}
@Injectable({ providedIn: 'root' })
export class SubmissionsService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'Submissions');
  }
}
@Injectable({ providedIn: 'root' })
export class PayslipSetupService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'PayslipDisplaySetup');
  }
}
@Injectable({ providedIn: 'root' })
export class LeaveSetupService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'LeaveSetup');
  }
}
@Injectable({ providedIn: 'root' })
export class CustomItemService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'customitem');
  }
}
@Injectable({ providedIn: 'root' })
export class PayFrequencyService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'PayFrequency');
  }
}
@Injectable({ providedIn: 'root' })
export class PublicHolidayService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'PublicHoliday');
  }
}
@Injectable({ providedIn: 'root' })
export class GoalGetterService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'GoalGetter');
  }
}
@Injectable({ providedIn: 'root' })
export class BulkPayRunUpdateService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'BulkPayRunUpdate');
  }
}
@Injectable({ providedIn: 'root' })
export class PayRunService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'PayRun');
  }
}
@Injectable({ providedIn: 'root' })
export class PayrollInputService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'PayrollInput');
  }
}
@Injectable({ providedIn: 'root' })
export class PayrollCalculationService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'payrollcalculation');
  }
}

