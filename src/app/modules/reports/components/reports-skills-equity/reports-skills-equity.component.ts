import { Component, Injector, OnInit } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { downloadSkillsEquityReportReportsAction, getSkillsEquityReportReportsAction } from '../../store/reports.action';
import { getDownloadedSkillsEquityReportSelector, getReportsLoadingSelector, getSkillsEquityReportSelector } from '../../store/reports.selector';
import { IEmployeeSkillsEquity } from 'src/app/modules/employee/employee.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { GenderType, IOptionItem, JobValueType, OccupationCategoryType, OccupationLevelType, ProvinceType, RaceType } from 'src/app/models/generic.model';
import { convertBase64ToBlob } from 'src/app/shared/util/convert-to-blob';
import { processDownloadedFile } from 'src/app/shared/util/formatting';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';

@Component({
  selector: 'kp-reports-skills-equity',
  templateUrl: './reports-skills-equity.component.html',
  styleUrls: ['./reports-skills-equity.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class ReportsSkillsAndEquityComponent extends GenericPage implements OnInit {
  public columns: string[] = ['Name', 'Gender', 'Race', 'Organizational Unit', 'Occupation Level', 'Occupation Category', 'Job Value', 'Province', 'Disabled', 'Foreign National', 'Not RSA Citizen'];
  public skillsEquityReport: IEmployeeSkillsEquity[];
  public genderType = GetTypes(GenderType);
  public raceType = GetTypes(RaceType);
  public occupationLevelType = GetTypes(OccupationLevelType);
  public occupationCategoryType = GetTypes(OccupationCategoryType);
  public jobValueType = GetTypes(JobValueType);
  public provinceType = GetTypes(ProvinceType);
  public downloadedSkillsEquityReport: any;

  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(getSkillsEquityReportReportsAction({
      payload: {
        searchText: '',
        pageNumber: 1,
        pagesize: 25,
        sortBy: 'Id', //note: need to check this
        sortAscending: true,
      }
    }));
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSkillsEquityReportSelector)),
      this.store.pipe(select(getDownloadedSkillsEquityReportSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([skillsEquityReport, downloadedSkillsEquityReport]) => {
        this.skillsEquityReport = skillsEquityReport;
        this.downloadedSkillsEquityReport = Object.assign({}, downloadedSkillsEquityReport);
        if (this.downloadedSkillsEquityReport?.data?.fileContents) {
          const result = convertBase64ToBlob(this.downloadedSkillsEquityReport.data.fileContents,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          processDownloadedFile(result, downloadedSkillsEquityReport, 'Skills and Equity Report');
        }
      });
  }

  public isLoadingAsync = () => this.store.pipe(select(getReportsLoadingSelector));

  public onExport(): void {
    this.store.dispatch(downloadSkillsEquityReportReportsAction({
      payload: {
        implementSortingAndPaging: true,
        language: 'en' //note: need to look at the proper lang culture
      }
    }));
  }

  public getType(value: number, options: IOptionItem[]): string {
    return options.find(option => option.value === value)?.label;
  }

  public get isAvailableForExport(): boolean {
    return this.skillsEquityReport?.length > 0 && this.downloadedSkillsEquityReport
      ? true
      : false;
  }
}
