import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import allLocales from '@fullcalendar/core/locales-all';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';
import * as moment from 'moment';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getPayrollEmployeeSetupDataSelector, getPayrunPublicHolidaySelector, getRestDaysForEmployeeSelector, getTimeAttendanceSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { IBasicSalaryShiftHour, IPayrollEmployeeSetupData, IPayrollInput } from '../../payroll.model';
import { IPublicHoliday } from 'src/app/modules/time-off/time-off.model';
import { getBasicSalaryPayrollInputSelector } from '../../store/payroll-input/payroll-input.selector';
import { getEmployeeShiftsSelector } from 'src/app/store/app.selector';
import { IEmployeeShift } from 'src/app/modules/employee/employee.model';
import { saveDailyWeeklyBreakdownHoursSalaryAction } from '../../store/payroll-input/payroll-input.action';


@Component({
  selector: 'kp-payroll-employee-setup-additional-hours',
  templateUrl: './payroll-employee-setup-additional-hours.component.html',
  styleUrls: ['./payroll-employee-setup-additional-hours.component.scss']
})
export class PayrollSetupAdditionalHoursComponent extends GenericPage implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  public payRunId: number;
  public employeeSetupData: IPayrollEmployeeSetupData;
  public calendarOptions: CalendarOptions = {
    locales: allLocales,
    locale: 'en', //note: get from global language
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    displayEventTime: false,
    weekends: true,
    showNonCurrentDates: false,
    fixedWeekCount: false,
    selectable: true,
    dateClick: (arg) => this.handleDateClick(arg),
    events: [],
  };
  public validFromDate: string = '2021-01-29T00:00:00';
  public validToDate: string = '2021-02-08T00:00:00';
  public restDaysForEmployee: string[];
  public publicHolidays: { title: string, start: string, end: string }[];
  public payRunPublicHoliday: IPublicHoliday[];
  public basicSalaryPayrollInput: IPayrollInput;
  public employeeShifts: IEmployeeShift[];
  public allEvents: any[] = [];
  public employeeAdditionalHoursModal: boolean = false;
  public timeAttendanceEnabled: boolean = false;

  constructor(injector: Injector) {
    super(injector);
    this.form = new FormGroup({
      normalHours: new FormControl(undefined, Validators.required),
      overtimeHours: new FormControl(undefined, Validators.required),
      employeeId: new FormControl(undefined, Validators.required),
      payRunId: new FormControl(undefined, Validators.required),
      dailyBreakdownType: new FormControl(undefined),
      basicSalaryShiftHoursViewModels: new FormControl(undefined),
      date: new FormControl(undefined)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getRestDaysForEmployeeSelector)),
      this.store.pipe(select(getPayrunPublicHolidaySelector)),
      this.store.pipe(select(getBasicSalaryPayrollInputSelector)),
      this.store.pipe(select(getEmployeeShiftsSelector)),
      this.store.pipe(select(getTimeAttendanceSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employeeSetupData, restDaysForEmployee, payRunPublicHoliday, basicSalaryPayrollInput, employeeShifts, timeAttendance]) => {
        this.employeeSetupData = employeeSetupData;
        if (this.employeeSetupData) {
          const { payRun } = this.employeeSetupData;
          this.calendarOptions.initialDate = new Date(payRun?.fromDate);
          this.calendarOptions.dateIncrement = { days: 1 };
          if (payRun?.fromDate)
            this.calendarOptions.validRange = { start: new Date(payRun.fromDate), end: new Date(payRun.toDate) };
          else
            this.calendarOptions.validRange = { start: new Date(this.validFromDate), end: new Date(this.validToDate) };
          this.restDaysForEmployee = restDaysForEmployee;
          this.payRunPublicHoliday = payRunPublicHoliday;
          this.employeeShifts = employeeShifts;
          if (this.restDaysForEmployee?.length > 0) {
            if (basicSalaryPayrollInput) {
              this.basicSalaryPayrollInput = basicSalaryPayrollInput;
              if (this.basicSalaryPayrollInput?.dailyBreakdownHours)
                this.allEvents = this.getDailyHoursBreakdownEvents(this.basicSalaryPayrollInput?.dailyBreakdownHours);
            }
            this.restDaysForEmployee = restDaysForEmployee;
            for (let item = 0; item < payRunPublicHoliday?.length; item++) {
              this.allEvents.push(this.getPublicHolidayEvents(payRunPublicHoliday[item]));
            }
            for (let item = 0; item < this.restDaysForEmployee?.length; item++) {
              const restDayDate = this.restDaysForEmployee[item];
              if (this.payRunPublicHoliday?.find(publicHoliday => publicHoliday.date !== restDayDate))
                this.allEvents.push(this.getRestDayEvent(restDayDate));
            }
          }
          this.timeAttendanceEnabled = !!timeAttendance;
          // if (this.timeAttendanceEnabled)
          //   this.form.disable();
          // else
          //   this.form.enable();
          this.calendarOptions.events = [];
          this.calendarOptions.events.push(...this.allEvents);
        }
      })
  }

  public onBack(): void {
    const { employee, payRun } = this.employeeSetupData;
    this.router.navigateByUrl(`/payroll/payruns/employee-setup/${employee?.id}/${payRun?.id}`)
  }

  public onSaveAdditionalHours(): void {
    if (this.form.valid) {
      this.store.dispatch(saveDailyWeeklyBreakdownHoursSalaryAction({
        payload: {
          DailyWeeklyBreakdownDetails: [{
            basicSalaryShiftHoursViewModels: this.form.get('basicSalaryShiftHoursViewModels').value,
            date: this.form.get('date').value,
            normalHours: this.form.get('normalHours').value,
            overtimeHours: this.form.get('overtimeHours').value,
            dailyBreakdownType: this.form.get('dailyBreakdownType').value,
          }],
          employeeId: this.form.get('employeeId').value,
          id: this.basicSalaryPayrollInput.id,
          payRunId: this.form.get('payRunId').value,
        }
      }));
      this.employeeAdditionalHoursModal = false;
    }
  }

  public handleDateClick(arg: any): void {
    let isSunday: boolean = false;
    let breakdownType: number;
    const today = new Date(arg?.dateStr);
    const selectedEvent = this.basicSalaryPayrollInput?.dailyBreakdownHours
      ?.find(event => moment(event?.date).format('MM/DD/YYYY') === moment(arg?.dateStr).format('MM/DD/YYYY'));
    const isPublicHoliday = this.allEvents?.filter(event => moment(new Date(event?.date), "MM-DD-YYYY")
      ?.isSame(arg?.dateStr, 'day'))?.length > 0;
    const isSpecialHoliday = this.allEvents?.filter(event => moment(new Date(event?.date), "MM-DD-YYYY")
      ?.isSame(arg?.dateStr, 'day')).length > 0;
    const todayFields = this.basicSalaryPayrollInput?.dailyBreakdownHours?.filter((el) => {
      return el.date.substring(0, 10) === arg?.dateStr;
    });
    const isRestDay = todayFields[0]
      ? (todayFields[0].basicSalaryDailyBreakdownType === 4
        ? true
        : false)
      : false;
    if (today?.getDay() === 0)
      isSunday = true
    else
      isSunday = false;
    if (isPublicHoliday)
      breakdownType = 1;
    else if (isSpecialHoliday)
      breakdownType = 3;
    else if (isSunday)
      breakdownType = 0;
    else if (isRestDay)
      breakdownType = 4;
    else
      breakdownType = 2;
    const { employee, payRun } = this.employeeSetupData;
    let basicSalaryShiftHours: IBasicSalaryShiftHour[] = [];
    if (selectedEvent) {
      basicSalaryShiftHours = selectedEvent?.basicSalaryShiftHours
        ?.map(shift => {
          return ({ normalHours: shift?.normalHours || 0, overtimeHours: shift?.overtimeHours || 0, shiftId: shift?.shiftId });
        });
    }
    else {
      basicSalaryShiftHours = this.employeeShifts?.map(shift => {
        return ({ normalHours: 0, overtimeHours: 0, shiftId: shift?.id });
      })
    }
    this.form.patchValue({
      normalHours: selectedEvent?.normalHours || 0,
      overtimeHours: selectedEvent?.overtimeHours || 0,
      employeeId: employee?.id,
      payRunId: payRun?.id,
      basicSalaryShiftHoursViewModels: basicSalaryShiftHours,
      dailyBreakdownType: selectedEvent?.basicSalaryDailyBreakdownType || breakdownType,
      date: moment(selectedEvent || arg?.dateStr).format('DD/MM/YYYY')
    });
    this.employeeAdditionalHoursModal = true;
  }

  private getDailyHoursBreakdownEvents(basicSalaryHours: any[]) {
    const events: EventInput[] = [];
    for (let salaryHour = 0; salaryHour < basicSalaryHours?.length; salaryHour++) {
      if (basicSalaryHours[salaryHour]?.normalHours > 0) {
        events.push({
          id: basicSalaryHours[salaryHour]?.id?.toString(),
          title: `${this.translateService.instant('Normal')} ${this.formatHours(basicSalaryHours[salaryHour]?.normalHours)}`,
          allDay: true,
          start: basicSalaryHours[salaryHour]?.date,
          backgroundColor: '#4d9de0',
          borderColor: '#4d9de0'
        });
      }
      if (basicSalaryHours[salaryHour]?.overtimeHours > 0) {
        events.push({
          id: basicSalaryHours[salaryHour]?.id?.toString(),
          title: `${this.translateService.instant('Overtime')}: ${this.formatHours(basicSalaryHours[salaryHour]?.overtimeHours)}`,
          allDay: true,
          start: basicSalaryHours[salaryHour]?.date,
          backgroundColor: '#ea526f',
          borderColor: '#ea526f'
        });
      }
      for (let shiftHour = 0; shiftHour < basicSalaryHours[salaryHour]?.basicSalaryShiftHours?.length; shiftHour++) {
        const shiftNormalHours = basicSalaryHours[salaryHour]?.basicSalaryShiftHours[shiftHour]?.normalHours;
        const shiftOvertimeHours = basicSalaryHours[salaryHour]?.basicSalaryShiftHours[shiftHour]?.overtimeHours;
        if (shiftNormalHours > 0) {
          events.push({
            id: basicSalaryHours[salaryHour]?.id?.toString(),
            title: `${this.getShiftName(basicSalaryHours[salaryHour]?.basicSalaryShiftHours[shiftHour]?.shiftId)} ${this.translateService.instant('Normal')} ${this.formatHours(shiftNormalHours)}`,
            allDay: true,
            start: basicSalaryHours[salaryHour]?.date,
            backgroundColor: '#4d9de0',
            borderColor: '#4d9de0'
          });
        }
        if (shiftOvertimeHours > 0) {
          const formattedShiftOvertimeHours = this.formatHours(shiftOvertimeHours);
          events.push({
            id: basicSalaryHours[salaryHour]?.id?.toString(),
            title: `${this.getShiftName(basicSalaryHours[salaryHour]?.basicSalaryShiftHours[shiftHour]?.shiftId)} ${this.translateService.instant('Overtime')} ${formattedShiftOvertimeHours}`,
            allDay: true,
            start: basicSalaryHours[salaryHour]?.date,
            backgroundColor: '#ea526f',
            borderColor: '#ea526f'
          });
        }
      }
    }
    return events;
  }

  private getShiftName(shiftId: number): string {
    return this.employeeShifts?.find(i => i.id === shiftId) ? this.employeeShifts?.find(i => i.id === shiftId).name : '';
  }

  private formatHours(hours: number): string {
    return hours % 1 !== 0 ? hours?.toFixed(2) : hours?.toString();
  }

  private getPublicHolidayEvents(holiday: IPublicHoliday): EventInput {
    return {
      allDay: true,
      backgroundColor: 'rgb(213 231 247)',
      borderColor: '#4d9de0',
      start: holiday?.date,
      title: holiday?.name,
      display: 'background'
    }
  }

  private getRestDayEvent(day: string): EventInput {
    return {
      allDay: true,
      backgroundColor: 'rgb(114 238 144)',
      borderColor: '#4d9de0',
      start: day,
      title: this.translateService.instant('RestDay'),
      display: 'background'
    }
  }
}
