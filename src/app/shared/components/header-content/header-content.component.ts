import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';

import { GenericDestroy } from '../../generics/generic-destroy-page';
import { fadeInAnimation } from '../../animations/fade-in.animation';
import { IPeopleStatus } from 'src/app/modules/people/people.model';
import { toCssClass } from '../../util/formatting';
import { EmploymentStatusType } from 'src/app/models/generic.enum';
import { convertBlobToBase64 } from '../../util/convert-to-blob';
import { uploadAvatarAction } from '../../../modules/employee/store/employee/employee.action';

@Component({
  selector: 'kp-header-content',
  templateUrl: './header-content.component.html',
  styleUrls: ['./header-content.component.scss'],
  animations: [fadeInAnimation(100)]
})
export class HeaderContentComponent extends GenericDestroy implements OnChanges {
  @Input() public bgImage: string = 'dashboard';
  @Input() public headerTitle: string = '';
  @Input() public logoRadius: 'square' | 'circle' = 'square';
  @Input() public employeeId: number = 0;
  @Input() public avatarPath: string = '';
  @Input() public isDefault: boolean | undefined = undefined;
  @Input() public isAppLogo: boolean = false;
  @Input() public appLogoName: string = '';
  @Input() public width: string = '1245px';
  @Input() public marginRight: string = '30px';
  @Input() public classLogo: string = '';
  @Input() public styleClass: string = '';
  @Input() public jobTitle: string;
  @Input() public dateOfAppointment: string;
  @Input() public isCompanyLogo: boolean = false;
  @Input() public status: IPeopleStatus;

  public toCssClass = toCssClass;
  public notInvited = EmploymentStatusType.NotInvited;
  public pending = EmploymentStatusType.Pending;
  public allowedFormats: string[] = ['jpeg', 'jpg', 'png', 'gif'];
  public showAvatar: boolean = false;

  constructor(
    private store: Store<AppState>,) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status'])
      this.status = changes['status'].currentValue;
  }

  public get toClass(): string {
    return this.status?.name?.toLowerCase()?.replace(/ +/g, "-");
  }

  public onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      convertBlobToBase64(file)
        .pipe(take(1), takeUntil(this.$unsubscribe))
        .subscribe((b64: any) => {
          if (b64)
            this.store.dispatch(uploadAvatarAction({
              payload: {
                employeeId: this.employeeId,
                fileName: file.name,
                image: window.btoa(b64),
              }
            }));
        })
    }
  }

  public get getLogoShape(): string {
    return this.logoRadius === 'square'
      ? '6px'
      : '50%'
  }

  public get getAppLogo(): string {
    switch (this.appLogoName) {
      case 'company-profile':
        return 'domain';
      case 'time-off':
        return 'calendar_month';
      case 'people':
        return 'people_alt';
      case 'expenses':
        return 'account_balance_wallet';
      case 'reports':
        return 'monitoring';
      case 'payroll':
        return 'payments';
      default:
        return '';
    }
  }

  public get getColor(): string {
    switch (this.bgImage) {
      case 'dashboard':
        return 'linear-gradient(80deg, rgb(94, 147, 240), rgb(156, 158, 240))';
      case 'employee':
        return 'linear-gradient(80deg, rgb(62, 201, 97), rgb(109, 233, 117))';
      case 'company-profile':
        return 'linear-gradient(80deg, rgb(255, 120, 120), rgb(255, 120, 169))';
      case 'time-off':
        return 'linear-gradient(80deg, rgb(255, 135, 105), rgb(255, 177, 81))';
      case 'dashboard-apps':
        return 'linear-gradient(80deg, rgb(143, 177, 173), rgb(141, 195, 183))';
      case 'expenses':
        return 'linear-gradient(80deg, rgb(118, 206, 239), rgb(99, 159, 240))';
      case 'reports':
        return 'linear-gradient(80deg, rgb(65, 197, 217), rgb(83, 214, 233))';
      case 'payroll':
        return 'linear-gradient(80deg, rgb(118, 206, 239), rgb(99, 159, 240))';
      default:
        return '';
    }
  }
}
