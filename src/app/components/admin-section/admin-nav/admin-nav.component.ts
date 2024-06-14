import { Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../../services/roster.service';
import moment from 'moment'; 
import {  Subscription } from 'rxjs';
import { SwapShift } from '../../../interface/swapShift';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.scss',
  encapsulation: ViewEncapsulation.None
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
  userId!:string | null;
  userCountCheck:any
  @ViewChild('publishToast') publishToast!: ElementRef; 
  swapCount:number = 0;
  rostersSubscription!: Subscription;
  swapHistory: Array<SwapShift> = [];

  constructor(
    private rosterService: RosterService
  ){ 
    this.validateUserRoster()
  }
   
  ngOnInit(){ 
    this.userId = localStorage.getItem('myID'); 
    this.getUserSwapHistory() 
  }

  ngAfterViewInit(){
    setInterval(()=>{
      this.getUserSwapHistory()
    }, 1000)
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
    // const toastElement = this.publishToast.nativeElement;
    // const bootstrapToast = new Toast(toastElement);
    // bootstrapToast.show();
    
  }
  
  routeToDash(){
    this.routeToDashboard.emit('all-dash')
  }

  getMonthRoster(month:string){
    this.changeMonth.emit(month)
  }
  getUserSwapHistory(){
    console.log(this.userId);
    
    if(this.userId)
    this.rostersSubscription = this.rosterService.userSwapHistory(this.userId).subscribe((res)=> {
      this.swapHistory = res 

      const stateOrder = ['Pending', 'Approved', 'Rejected'];
      this.swapHistory.sort((a, b) => {
        return stateOrder.indexOf(a.state) - stateOrder.indexOf(b.state);
      });

      this.swapCount = this.swapHistory.filter(el => el.state == 'Pending').length
    });
  }
  swapRequestState(state:string, item:SwapShift){ 
    if(state === 'Approved'){
      item.state = 'Approved' 
     this.rostersSubscription = this.rosterService.updateSwap(item).subscribe(res => {
          console.log(res)
      })
    }else{
      item.state = 'Rejected'
      this.rosterService.updateSwap(item).subscribe(res => {
        console.log(res);
      })

    }  
  }



  createRoster(){
    this.rostersSubscription = this.rosterService.createUserRosters().subscribe(
      (res:any) => {
       console.log(res)
      }
    ) 
    setTimeout(()=>{
      location.reload()
    },2000)
    
  }

  signOut(){
    localStorage.clear()
    location.reload()
  }
  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }
}
