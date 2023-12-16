import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Roster } from '../../../interface/roster';
import moment from 'moment';
import { DaysFormatterPipe } from "../../../pipes/days-formatter.pipe";
import { RosterService } from '../../../services/roster.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-user-roster',
    standalone: true,
    templateUrl: './user-roster.component.html',
    styleUrl: './user-roster.component.scss',
    imports: [CommonModule, DaysFormatterPipe, FormsModule],
    providers:[RosterService]
})
export class UserRosterComponent {

  currentDate: moment.Moment = moment()
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  days:any = []
  options:string[] = ['PH', 'CO', 'L']
  userCurrentRoster!:any;
  rosterUserData:Array<Roster> = [];
  response: any;
  editRoster:boolean = false;

  @Output() userNavigateToCurrent = new EventEmitter<Event>;

  constructor(
    private rosterService: RosterService
  ){
    this.getUserRosterData()
  }

  getUserRosterData(){
    const userId = localStorage.getItem('myID')
    this.rosterService.sendUserId(userId).subscribe((res:any)=>{
      this.userCurrentRoster = res
      this.rosterUserData = this.userCurrentRoster.rosterData[0].roster;
      console.log(this.rosterUserData)
     })
  }


   updateUserRoster(){
    const userRosterData = {
      userId: localStorage.getItem('myID'),
      userName: localStorage.getItem('userName'),
      currentMonth: this.currentDate.format('MMMM'),
      monthData : this.rosterUserData
    }
    this.rosterService.sendCurrentRoster(userRosterData).subscribe((res:any)=>{
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
}