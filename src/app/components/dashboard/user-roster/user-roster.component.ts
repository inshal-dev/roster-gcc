import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Roster } from '../../../interface/roster';
import moment from 'moment';
import { DaysFormatterPipe } from "../../../pipes/days-formatter.pipe";
import { RosterService } from '../../../services/roster.service';
import { FormsModule } from '@angular/forms';
import { Subscribable, Subscriber, Subscription } from 'rxjs';

@Component({
    selector: 'app-user-roster',
    standalone: true,
    templateUrl: './user-roster.component.html',
    styleUrl: './user-roster.component.scss',
    imports: [CommonModule, DaysFormatterPipe, FormsModule],
    providers:[RosterService]
})
export class UserRosterComponent {

  currentDate: moment.Moment = moment().add(1, 'month')
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  days:any = []
  options:string[] = ['PH', 'CO', 'L']
  userCurrentRoster!:any;
  rosterUserData:Array<Roster> = [];
  response: any;
  editRoster:boolean = false;
  month:any = this.currentDate.format('MMMM');
  rosterArrayLength!:number;
  monthList:Array<string> = [
    'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  date!:number;
  rostersSubscription!: Subscription; 

  @Input() months!:string;
  @Output() userNavigateToCurrent = new EventEmitter<Event>;

  constructor(
    private rosterService: RosterService
  ){  
    this.date = this.currentDate.date()
    this.getUserRosterData()
  }

  ngOnChanges(){
    console.log(this.months);
    this.rosterUserData = []
    this.getUserRosterData()

   
  }
  getUserRosterData(){
    if(this.months == undefined){
      this.months = this.month
    }    
    const userId = localStorage.getItem('myID')
    this.rostersSubscription = this.rosterService.getUserRosterbyIDMonth(userId, this.months).subscribe((res:any)=>{
      this.userCurrentRoster = res  
      this.rosterArrayLength = this.userCurrentRoster.rosterData.length
    //  console.log(this.rosterArrayLength);
      
      this.rosterUserData = this.userCurrentRoster?.rosterData[0]?.roster;
     // console.log(this.rosterUserData)
     })
  }


   updateUserRoster(){
    const userRosterData = {
      userId: localStorage.getItem('myID'),
      userName: localStorage.getItem('userName'),
      currentMonth: this.currentDate.format('MMMM'),
      monthData : this.rosterUserData
    }
    this.rostersSubscription = this.rosterService.sendCurrentRoster(userRosterData).subscribe((res:any)=>{
      this.response = res.response
    })
    this.editRoster = false
  }

  editUserRoster(){
    this.editRoster = true
  }

  routetoCurrent(value:any){
    this.userNavigateToCurrent.emit()
  }

  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }
}
