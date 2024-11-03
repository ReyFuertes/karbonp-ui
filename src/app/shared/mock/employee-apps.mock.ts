import { AppDashboardType, AppMenuType } from "src/app/models/generic.enum";
import { IApplication } from "src/app/modules/employee/employee.model";

export const advanceTier: IApplication[] = [
  {
    id: 'd5c28318-7a46-4a9b-8922-fc2977748cb0',
    name: AppDashboardType.People,
    description: '',
    menuType: AppMenuType.People, 
    options: '{ "icon": "group", "class": "people", "route": "/people", "disabled": false, "available": true }',
  }, {
    id: 'a395e10b-d03e-4d2f-bdff-54d1ff8c37de',
    name: AppDashboardType.TimeOff,
    description: 'Manage holidays, sickness, and more',
    menuType: AppMenuType.TimeOff, 
    options: '{ "icon": "calendar_month", "class": "time-off", "route": "/time-off", "disabled": false, "available": true }'
  }, 
  {
    id: 'cca41259-3bb7-4411-9066-b6dc988bc98b',
    name: AppDashboardType.Reports,
    description: '',
    menuType: AppMenuType.Reports, 
    options: '{ "icon": "monitoring","class": "reports", "route": "/reports", "disabled": false, "available": true }'
  }, {
    id: '774c2770-73a7-4e94-bcf8-6b8aeeb09932',
    name: AppDashboardType.Payroll,
    description: '',
    menuType: AppMenuType.Payroll, 
    options: '{ "icon": "payments", "class": "payroll", "route": "/payroll", "disabled": false, "available": true }'
  }
];
