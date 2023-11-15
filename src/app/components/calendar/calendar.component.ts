import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { DaysFormatterPipe } from '../../pipes/days-formatter.pipe';
import moment from 'moment';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roster } from '../../interface/roster';
import { RosterService } from '../../services/roster.service';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DaysFormatterPipe, NgFor, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  currentDate: moment.Moment = moment()
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  options:string[] = ['PH', 'CO']
  edit:Boolean = false;
  rosterCalendar:Array<any> = [];
  holidayForm!: FormGroup;
  currentMonth:Array<any> = []
  selectedOption:any

  days:any = []
  constructor( 
    private fb: FormBuilder,
    private rosterService: RosterService
    ){
    this.holidayForm = this.fb.group({ 
      description: ['', Validators.required]
    });

    this.getDaysInMonth()
  } 


  getUserLeave(){    
    const userRosterData = {
      userId: localStorage.getItem('myID'),
      currentMonth: this.currentDate.format('MMMM'),
      monthData : this.days
    }
    console.log(userRosterData);
    this.rosterService.sendCurrentRoster(userRosterData).subscribe((res:any)=>{
      console.log(res);
      this.edit = false
    })
    
  }
  getDaysInMonth() {
    this.days= [];
    this.currentMonth = []
    const daysInMonth = this.currentDate.daysInMonth(); 
    const firstDay = moment(this.currentDate).startOf('month');


    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(firstDay).date(i);
      const day = {
        date,
        dayNumber: i,
        weekday: date.format('ddd'),
        option: null
      };
      this.days.push(day);
    }

    const firstDayOfWeek = moment(firstDay).day();
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.days.unshift(null);
    }  
    console.log(this.days); 
    return this.days;
  }

  previousMonth() {
    this.currentDate = this.currentDate.subtract(1, 'months');
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, 'months');
  }

  editRoster(){
    this.edit = true
  }

  // getUserRoster(){ 

  //     if (this.holidayForm.valid) { 
  //       const description = this.holidayForm.get('description')?.value;
  //        console.log(description);
         
  //       // Clear the form
  //       this.holidayForm.reset();
  //     }
  // }

  trackByFn(index: any, item: any) {
    return index;
  } 
  
}