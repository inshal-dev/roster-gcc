import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../../services/roster.service';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.scss'
})
export class AdminNavComponent {
  @Output() rosterPublishState = new EventEmitter<any>;
  month!:string;
  selectValue:any;
  monthList:Array<string> = [
    'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ] 

  constructor(
    private rosterService: RosterService
  ){

  }
   

  publishRoster(value:string){ 
    this.rosterPublishState.emit(value) 
  }

  createRoster(){
    this.rosterService.createUserRosters().subscribe(
      (res:any) => {
        console.log(res)
      }
    )
  }

  signOut(){
    localStorage.clear()
    location.reload()
  }
}
