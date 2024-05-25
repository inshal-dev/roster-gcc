import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Roster } from '../../../interface/roster';
import moment from 'moment';
import { DaysFormatterPipe } from "../../../pipes/days-formatter.pipe";
import { RosterService } from '../../../services/roster.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs'; 
import { Modal, Toast } from 'bootstrap';   

@Component({
    selector: 'app-user-roster',
    standalone: true,
    templateUrl: './user-roster.component.html',
    styleUrl: './user-roster.component.scss',
    imports: [CommonModule, DaysFormatterPipe, FormsModule],
    providers:[RosterService]
})
export class UserRosterComponent {

  currentDate: moment.Moment = moment().add(1, 'month')
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  days:any = []
  options:string[] = ['PH', 'CO', 'L']
  userCurrentRoster!:any;
  rosterUserData:Array<Roster> = [];
  response: any;
  editRoster:boolean = false;
  month:any = this.currentDate.format('MMMM');
  rosterArrayLength!:number;
  monthList:Array<string> = [
    'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  date!:number;
  rostersSubscription!: Subscription; 
  mouseState:boolean = false
  modalTempData!: Roster | any;
  @Input() months!:string;
  @Output() userNavigateToCurrent = new EventEmitter<Event>;
  @ViewChild('reasonCO')
  toastCO!: ElementRef; 

  constructor(
    private rosterService: RosterService
  ){  
    this.date = this.currentDate.date()
    this.getUserRosterData()
  }

  ngOnChanges(){
    console.log(this.months);
    this.rosterUserData = []
    this.getUserRosterData()

   
  }

  
  getUserRosterData(){
    if(this.months == undefined){
      this.months = this.month
    }    
    const userId = localStorage.getItem('myID')
    this.rostersSubscription = this.rosterService.getUserRosterbyIDMonth(userId, this.months).subscribe((res:any)=>{
      this.userCurrentRoster = res  
      this.rosterArrayLength = this.userCurrentRoster.rosterData.length
    //  console.log(this.rosterArrayLength);
      
      this.rosterUserData = this.userCurrentRoster?.rosterData[0]?.roster;
     console.log(this.rosterUserData)
     })
  }
 
   updateUserRoster(){
    const userRosterData = {
      userId: localStorage.getItem('myID'),
      userName: localStorage.getItem('userName'),
      category: localStorage.getItem('category'),
      currentMonth: this.currentDate.format('MMMM'),
      monthData : this.rosterUserData
    } 
    
    this.rostersSubscription = this.rosterService.sendCurrentRoster(userRosterData).subscribe((res:any)=>{
      this.response = res.response
    })
    this.editRoster = false
  }

  editUserRoster(){
    this.editRoster = true
  } 

  optionChange(day:Roster){
    console.log(day);
    this.modalTempData = day
    if(day.option == 'CO'){ 
      const toastElement = this.toastCO.nativeElement;
      const bootstrapModal = new Modal(toastElement)
      bootstrapModal.show();
    } 
  }
  submitCOreason(){
    const toastElement = this.toastCO.nativeElement;
    const bootstrapModal = new Modal(toastElement)
    bootstrapModal.hide();  
    // let date = this.modalTempData?.date
    // if(date !== null){
    //   const itemToUpdate:any = this.rosterUserData.find(item => item?.date == date);
    //   console.log(itemToUpdate);
    // }else{
    //   console.log('No date', date);
      
    // }
   

 
    
    // if (itemToUpdate) {
    //     itemToUpdate.reason = this.modalTempData?.reason;
    // }  
  }

  routetoCurrent(value:any){
    this.userNavigateToCurrent.emit()
  }

  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }
}
