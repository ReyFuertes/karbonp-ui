import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { getEmployeeBulkImportViewAction } from '../../store/employee/employee.action';
import { LocalService } from 'src/app/services/local-storage.service';
import { AppState } from 'src/app/store';

@Component({
  selector: 'kp-employee-menu',
  templateUrl: './employee-menu.component.html',
  styleUrls: ['./employee-menu.component.scss']
})
export class EmployeeMenuComponent {
  public avatarPath: string = '';
  public imgPath: string = environment.imgPath;
  public quickAddTranslateParam: { [key: string]: string };

  constructor(private store: Store<AppState>, private router: Router, private localService: LocalService) {
    this.avatarPath = this.imgPath + 'sample-employee-logo.png';
    this.quickAddTranslateParam = {
      CompanyName: this.localService.getEncItem('companyName')
        ? JSON.parse(this.localService.getEncItem('companyName'))
        : 'YourCompanyName'
    };
    this.store.dispatch(getEmployeeBulkImportViewAction());
  }

  public gotoBulkImport(): void {
    this.router.navigateByUrl('employee/bulk-import');
  }

  public gotoQuickAdd(): void {
    this.router.navigateByUrl('employee/quick-add');
  }

  public gotoAddEmployee(): void {
    this.router.navigateByUrl('employee/add');
  }
}
