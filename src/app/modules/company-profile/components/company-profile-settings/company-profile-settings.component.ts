import { Component, Injector } from '@angular/core';

import { DISABLED_COMPANY_PROFILE } from 'src/app/shared/constants/wordings.constant';
import { GenericApplicationSetting } from 'src/app/shared/generics/application-settings.generic';
import { AppDashboardType } from 'src/app/models/generic.enum';

@Component({
  selector: 'kp-company-profile-settings',
  templateUrl: './company-profile-settings.component.html',
  styleUrls: ['./company-profile-settings.component.scss']
})
export class CompanyProfileSettingsComponent extends GenericApplicationSetting {
  public disabledDescription: string = DISABLED_COMPANY_PROFILE;

  constructor(injector: Injector) {
    super(injector);
    this.appDashboardType = AppDashboardType.CompanyProfile;
  }
}
