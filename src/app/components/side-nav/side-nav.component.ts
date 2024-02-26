import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, FormsModule],
    templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  momentsMonth = moment().add(1, 'month')
  months:Array<string> = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  currentMonth!:string;
  userName!:string | null;
  userNavValue:string = 'currentRoster';

  @Output() userInputNav = new EventEmitter<any>
  @Input() navValueDashboard!:any;

  //Style

  navSelectStyle = {
    "border-left": "4px solid #3983F2",
   " border-radius": "4px",
   "background": "#DFEAFC"

  }

  ngOnInit(){
    this.currentMonth = this.months[this.momentsMonth.month()]
    this.userName = localStorage.getItem('userName')
    this.userNavValue= 'currentRoster';
  }

  ngOnChanges(){

    this.userNavValue = this.navValueDashboard

  }

  userSelectionNav(value:any){
    this.userNavValue = value
    this.userInputNav.emit(this.userNavValue)
  }

  signOut(){
    localStorage.clear()
    location.reload()
  }

}
