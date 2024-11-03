import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { environment } from 'src/environments/environment';
import { IMenuReport } from '../../reports.model';
import { ReportsStateService } from '../../reports.service';
import { FormState } from 'src/app/models/generic.enum';

@Component({
  selector: 'kp-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class ReportsListComponent {
  public menuReports: IMenuReport[] = [{
    label: 'ETIReport',
    route: 'eti',
    icon: 'generate-report.png'
  }, {
    label: 'BalancesReport',
    route: 'balances',
    icon: 'generate-report.png'
  }, {
    label: 'SkillAndEquityReport',
    route: 'skills-equity',
    icon: 'generate-report.png'
  }, {
    label: 'DetailedPayrollReport',
    route: 'detailed-payroll',
    icon: 'generate-report.png'
  }, {
    label: 'EmployeeInformationReport',
    route: 'information',
    icon: 'generate-report.png'
  }];
  public reportIconUrl: string = environment.imgPath;

  constructor(private router: Router, private reportsService: ReportsStateService) { }

  public onCreateReport(): void {
    this.router.navigateByUrl('reports/create');
    this.reportsService.setState(FormState.add);
  }

  public gotoRoute(route: string): void {
    this.router.navigateByUrl(`/reports/${route}`);
    localStorage.setItem('reportsListSelectedItemMenu', JSON.stringify(route));
  }
}
