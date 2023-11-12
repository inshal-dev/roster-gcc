import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  currentDate: moment.Moment = moment();
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  getDaysInMonth() {
    const days = [];
    const daysInMonth = this.currentDate.daysInMonth();
    const firstDay = moment(this.currentDate).startOf('month');

    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(firstDay).date(i);
      const day = {
        date,
        dayNumber: i,
        weekday: date.format('ddd') // Get the weekday abbreviation (e.g., "Mon")
      };
      days.push(day);
    }

    const firstDayOfWeek = moment(firstDay).day();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.unshift(null);
    }

    return days;
  }

  previousMonth() {
    this.currentDate = this.currentDate.subtract(1, 'months');
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, 'months');
  }

}
