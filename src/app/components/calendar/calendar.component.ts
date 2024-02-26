import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { DaysFormatterPipe } from '../../pipes/days-formatter.pipe';
import moment from 'moment';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DaysFormatterPipe, NgFor],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  currentDate: moment.Moment = moment().add(1, 'months');
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  days:any = []
  userEditStatus:any = false

  @Output() editRoster = new EventEmitter<string>();

  constructor(){
    this.getDaysInMonth()
  }

  //Emit user wants to edit roster
  rosterChange() {
    this.userEditStatus = true
    this.editRoster.emit(this.userEditStatus);
  }

  //main: get current month calendar
  getDaysInMonth() {
    this.days= []; 
    
    const daysInMonth = this.currentDate.daysInMonth(); 
    const firstDay = moment(this.currentDate).startOf('month');


    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(firstDay).date(i);
      const day = {
        date,
        dayNumber: i,
        weekday: date.format('ddd'),
      };
      this.days.push(day);
    }

    const firstDayOfWeek = moment(firstDay).day();
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.days.unshift(null);
    }
    return this.days;
  }

  // previousMonth() {
  //   this.currentDate = this.currentDate.subtract(1, 'months');
  // }

  // nextMonth() {
  //   this.currentDate = this.currentDate.add(1, 'months');
  // }

}
