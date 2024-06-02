import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { DaysFormatterPipe } from "../../../pipes/days-formatter.pipe";
import { FormsModule } from '@angular/forms'; 
import { Roster } from '../../../interface/roster';
import { RosterService } from '../../../services/roster.service';
import { Subscription } from 'rxjs';
import { Modal } from 'bootstrap';   
@Component({
    selector: 'app-roster-edit',
    standalone: true,
    templateUrl: './roster-edit.component.html',
    styleUrl: './roster-edit.component.scss',
    imports: [CommonModule, DaysFormatterPipe, FormsModule]
})
export class RosterEditComponent {

  currentDate: moment.Moment = moment().add(1, 'months')
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months:Array<string> = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  days:any = []
  options:string[] = ['PH', 'CO', 'L']
  userCurrentRoster!:any;
  rosterUserData:Array<Roster> = [];
  response: any;
  currentMonth:any;
  previousMonth:any
  modalTempData!: Roster | any;
  @Output() editRoster = new EventEmitter<any>();
  @Output() userNavigateTo = new EventEmitter<any>();
  currentMonthValue: any; 

  @ViewChild('reasonCO')
  toastCO!: ElementRef; 
  rostersSubscription!: Subscription;

  constructor(
    private rosterService: RosterService
  ){
    this.getDaysInMonth()
    this.getUserRosterData()
    console.log(this.currentDate)
  }


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
        option:null,
        reason:null,
      };
      this.days.push(day); 
      
    }

    const firstDayOfWeek = moment(firstDay).day();
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.days.unshift(null);
    }
    this.currentMonthValue = this.months[this.currentDate.month()]
    console.log(this.currentMonthValue);
    
    return this.days;
  }

  //Get user roster for current month @if submitted
  getUserRosterData(){ 
    const userId = localStorage.getItem('myID')
    this.rostersSubscription = this.rosterService.getUserRosterbyIDMonth(userId, this.currentMonthValue).subscribe((res:any)=>{
      this.userCurrentRoster = res 
      this.previousMonth = this.userCurrentRoster.rosterData[0].currentMonth
   
      this.currentMonth = this.currentDate.startOf("month").format('MMMM')
      
      this.rosterUserData = this.userCurrentRoster.rosterData[0].roster;
      console.log(this.rosterUserData); 
     })
  }

  optionChange(day:Roster){
    console.log(day);
    this.modalTempData = day
    if(day.option == 'CO'){ 
      const toastElement = this.toastCO.nativeElement;
      const bootstrapModal = new Modal(toastElement)
      bootstrapModal.show();
    } 
  }
  
  //Current month roster submit
  submitUserRoster(){
      const userRosterData = {
        userId: localStorage.getItem('myID'),
        userName: localStorage.getItem('userName'),
        currentMonth: this.currentDate.format('MMMM'),
        category: localStorage.getItem('category'),
        group: localStorage.getItem('group'),
        monthData : this.days
      }

      this.rostersSubscription = this.rosterService.sendCurrentRoster(userRosterData).subscribe((res:any)=>{
        this.response = res.response
        
        this.editRoster.emit(false)
      })

  }
  submitCOreason(){
    const toastElement = this.toastCO.nativeElement;
    const bootstrapModal = new Modal(toastElement)
    bootstrapModal.hide();  
   
  }
  openUserRoster(value:any){
    this.userNavigateTo.emit(value)
  }

  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }


}
