import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { FormsModule } from '@angular/forms';

import { RosterEditComponent } from './roster-edit/roster-edit.component';
import { UserRosterComponent } from './user-roster/user-roster.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CalendarComponent, RosterEditComponent, FormsModule, UserRosterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @Input() userNavValue!:any;
  @Output() navValueDash = new EventEmitter<any>();
  editRosterStatus:boolean = false

  ngOnInit(){
    this.userNavValue = 'currentRoster'
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
