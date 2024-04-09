import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/roster.service';

@Component({
  selector: 'app-all-view-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-view-dashboard.component.html',
  styleUrl: './all-view-dashboard.component.scss'
})
export class AllViewDashboardComponent {
  @Output() routetoPreviousState = new EventEmitter<any>;
  currentDate: moment.Moment = moment()
  month:any = this.currentDate.format('MMMM'); 
  monthList:Array<string> = [
    'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  dateObject:Array<any> = [];
  rosterData:any = [];

  constructor(
    private rosterService: RosterService
  ){  
    this.getRosterData(this.month)

  }

  getRosterData(month:string){
    console.log(month)
    this.dateObject = []
    this.rosterData = []
    if(month){
      this.rosterService.getRosterforDashboard(month).subscribe((res) =>{
        console.log(res)
        this.rosterData = res
        this.rosterData[0].roster.forEach((el:any) => {
          if(el?.dayNumber){
           this.dateObject.push({
             date : el.dayNumber,
             day : el.weekday
           })
          }
        })

      },(err) =>{
        console.log(err)
      }
      )
    }
  }
  
  routeBack(){
    this.routetoPreviousState.emit(true)

  }
}
