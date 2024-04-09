import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-head-nav',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './head-nav.component.html',
  styleUrl: './head-nav.component.scss'
})
export class HeadNavComponent {
  @Output() selectedMonth = new EventEmitter<any>;
  currentDate: moment.Moment = moment().add(1, 'month')
  month:any = this.currentDate.format('MMMM');
  @Output() routeDashboard = new EventEmitter<any>;

  monthList:Array<string> = [
    'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]

  

  constructor(){ 
  }

  RoutetoAllViewDashboard(value:string){
    this.routeDashboard.emit(value)
  }
  passSelectedMonth(value:string){  
    this.selectedMonth.emit(value) 
    console.log(value);
    
  }
}
