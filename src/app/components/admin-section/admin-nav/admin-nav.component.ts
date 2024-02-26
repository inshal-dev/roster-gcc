import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  publishRoster(value:string){ 
    this.rosterPublishState.emit(value) 
  }

  signOut(){
    localStorage.clear()
    location.reload()
  }
}
