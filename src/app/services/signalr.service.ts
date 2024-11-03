import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  signalUrl = environment.signalUrl;
  private hubConnection: signalR.HubConnection
  public signalREmmitter = new EventEmitter<any>();
  public maintenancePageEmmitter = new EventEmitter<any>();
  public employeeBulkImportEmmitter = new EventEmitter<any>();
  public payRunBulkImportEmmitter = new EventEmitter<any>();
  public timeOffBulkImportEmmitter = new EventEmitter<any>();
  public employeeBulkOffboardingImportEmmitter = new EventEmitter<any>();
  public employeeShiftRosterImportEmmitter = new EventEmitter<any>();
  public timeAndAttendanceBulkImportEmmitter = new EventEmitter<any>();

  constructor() { }

  public startConnection = (userId: number) => {
    if (this.hubConnection == null || this.hubConnection.state != 'Connected') {
       this.hubConnection = new signalR.HubConnectionBuilder()
         .configureLogging(signalR.LogLevel.Error)
         .withUrl(this.signalUrl + 'signalRHub?userKey=' + userId)
         .build();

       this.hubConnection
         .start()
         .then(() => console.log('Connection started'))
         .catch(err => console.log('Error while starting connection: ' + err))

       this.hubConnection.on('KarbonPayUserNotification', (data) => {
         this.signalREmmitter.emit(data);
       });

       this.hubConnection.on('KarbonPayMaintenancePageUpdate', (data) => {
         this.maintenancePageEmmitter.emit(data);
       });

       this.hubConnection.on('EmployeeBulkImportUpdate', (data) => {
         this.employeeBulkImportEmmitter.emit(data);
       });

       this.hubConnection.on('TimeOffBulkImportUpdate', (data) => {
         this.timeOffBulkImportEmmitter.emit(data);
       });

       this.hubConnection.on('PayRunBulkImportUpdate', (data) => {
         this.payRunBulkImportEmmitter.emit(data);
       });

       this.hubConnection.on('EmployeeBulkOffboardingImport', (data) => {
         this.employeeBulkOffboardingImportEmmitter.emit(data);
       });

       this.hubConnection.on('EmployeeShiftRosterImportUpdate', (data) => {
         this.employeeShiftRosterImportEmmitter.emit(data);
       });

       this.hubConnection.on('TimeAndAttendanceBulkImportUpdate', (data) => {
         this.timeAndAttendanceBulkImportEmmitter.emit(data);
       });
    }
  }

   public linkEmployeeBulkImportGroup = (groupName: string) => {
     if (this.hubConnection != null && this.hubConnection.state == 'Connected') {
       this.hubConnection.invoke("AddToBulkEmployeeImportGroup", groupName).catch(err => {
         console.log(err);
       });
     }
   }

   public linkTimeOffBulkImportGroup = (groupName: string) => {
     if (this.hubConnection != null && this.hubConnection.state == 'Connected') {
       this.hubConnection.invoke("AddToBulkTimeOffImportGroup", groupName).catch(err => {
         console.log(err);
       });
     }
   }

   public linkPayRunBulkImportGroup = (groupName: string) => {
     if (this.hubConnection != null && this.hubConnection.state == 'Connected') {
       this.hubConnection.invoke("AddToBulkPayRunImportGroup", groupName).catch(err => {
         console.log(err);
       });
     }
   }

   public linkEmployeeBulkOffboardingImportGroup = (groupName: string) => {
     if (this.hubConnection != null && this.hubConnection.state == 'Connected') {
       this.hubConnection.invoke("AddToBulkEmployeeOffboardingImportGroup", groupName).catch(err => {
         console.log(err);
       });
     }
   }

   public linkEmployeeShiftRosterImportGroup = (groupName: string) => {
     if (this.hubConnection != null && this.hubConnection.state == 'Connected') {
       this.hubConnection.invoke("AddToBulkEmployeeShiftRosterImportGroup", groupName).catch(err => {
         console.log(err);
       });
     }
   }

   public linkTimeAndAttendanceBulkImportGroup = (groupName: string) => {
     if (this.hubConnection != null && this.hubConnection.state == 'Connected') {
       this.hubConnection.invoke("AddToTimeAndAttendanceImportGroup", groupName).catch(err => {
         console.log(err);
       });
     }
   }
}
