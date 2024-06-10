import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { FormsModule } from '@angular/forms';

import { RosterEditComponent } from './roster-edit/roster-edit.component';
import { UserRosterComponent } from './user-roster/user-roster.component';
import { PublishRosterUserComponent } from './publish-roster-user/publish-roster-user.component';
import { ShiftSwapComponent } from './shift-swap/shift-swap.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CalendarComponent, RosterEditComponent, FormsModule, UserRosterComponent, PublishRosterUserComponent, ShiftSwapComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @Input() userNavValue!:any;
  @Input() month!:string; 
  @Output() navValueDash = new EventEmitter<any>();

  editRosterStatus:boolean = false
  monthValue!:string
  ngOnInit(){
    this.userNavValue = 'currentRoster'
  }
  ngOnChanges(){ 
    this.monthValue = this.month
    //console.log(this.monthValue);
    
  }
  rosterEdit(){
    this.editRosterStatus = true
  }
  rosterUpdate(){
    this.editRosterStatus = false
  }

  userNavRoute(value:any){
    this.userNavValue = value
    this.navValueDash.emit(this.userNavValue)

  }
}
