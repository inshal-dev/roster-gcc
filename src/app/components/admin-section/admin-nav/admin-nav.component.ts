import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../../services/roster.service';
import moment from 'moment';
import { Toast } from 'bootstrap';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.scss'
})
export class AdminNavComponent {
  @Output() rosterPublishState = new EventEmitter<any>; 
  @Output() changeMonth = new EventEmitter<any>;
  @Output() routeToDashboard = new EventEmitter<any>;
  selectValue:any;
  monthList:Array<string> = [
    'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ] 
  currentDate: moment.Moment = moment().add(1, 'month')
  month:string = this.currentDate.format('MMMM');

  userCountCheck:any
  @ViewChild('publishToast') publishToast!: ElementRef; 

  rostersSubscription!: Subscription;

  constructor(
    private rosterService: RosterService
  ){ 
    this.validateUserRoster()
  }
   

  validateUserRoster(){
    this.rostersSubscription = this.rosterService.unApprovedCountCheck().subscribe(
     (res) => {
      this.userCountCheck = res 
      console.log(this.userCountCheck.state, this.userCountCheck.count)
     }
    )

  }

  publishRoster(value:string){ 
    this.rosterPublishState.emit(value) 
    const toastElement = this.publishToast.nativeElement;
    const bootstrapToast = new Toast(toastElement);
    bootstrapToast.show();
    
  }

  routeToDash(){
    this.routeToDashboard.emit('all-dash')
  }

  getMonthRoster(month:string){
    this.changeMonth.emit(month)
  }

  createRoster(){
    this.rostersSubscription = this.rosterService.createUserRosters().subscribe(
      (res:any) => {
       // console.log(res)
      }
    ) 
    location.reload()
  }

  signOut(){
    localStorage.clear()
    location.reload()
  }
  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }
}
