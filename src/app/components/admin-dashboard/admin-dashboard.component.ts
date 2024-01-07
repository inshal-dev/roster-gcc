import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RosterService } from '../../services/roster.service';
import { Subscribable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'; 
import { UserRoster } from '../../interface/userRoster';
import io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  rostersSubscription!: Subscription
  rosterData:any
  sel:any
  selectedUser!:UserRoster;
  date:Array<any> = [];
  startDate!:number;
  endDate!:number;
  rosterValue!:string;

  rosterObjectId!:string;
  message$: BehaviorSubject<string> = new BehaviorSubject(''); 
  socket = io('http://localhost:3000');

  options:Array<string> = [
    "T1", "S1", "F3", "G2", "G1", "CO", "PH", "L"
  ]
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  constructor(
    private rosterService: RosterService, 
  ){
  }

  ngOnInit(){
    this.getRosterData() 
    // window.addEventListener('beforeunload', (e)=> {
    //   e.preventDefault();
    //   e.returnValue = '';
    // })
  }

  ngOnChanges(){ 

  }

  getRosterData(){
    this.rostersSubscription = this.rosterService.getRosters().subscribe(
      (res) => {
        this.rosterData = res  
        this.rosterObjectId = this.rosterData.data[0]._id 
        if(this.rosterData.res == 'pre-published'){ 
          this.rosterData = this.rosterData.data[0].roster
        }else{
          this.rosterData = this.rosterData.data[0].roster
        } 
        //check this logic again 
          this.rosterData[0].roster.forEach((el:any) => {
           if(el?.dayNumber){
            this.date.push(el.dayNumber)
           }else{
            console.log('no data'); 
           } 
          }) 
         
        return this.date 
      }
    )
  }

  submitRoster(){
    console.log(this.rosterData)
    this.rostersSubscription = this.rosterService.publishRoster(this.rosterData).subscribe((res)=>{
      console.log('Roster Published'); 
    }, (err)=> console.log(err))
  }


  //update selected users

  updateSelected(id:string){ 
    if(this.rosterData){
      this.rosterData.find((item:any)=> {
        item.userId == id ? this.selectedUser = item : ''
      })
    }
    console.log(this.selectedUser); 
  }

  getDates(startDate:any, endDate:any, rosterValue:string){
    console.log(startDate, endDate, rosterValue);
    this.selectedUser.roster.forEach(el => {
     // console.log(el?.dayNumber >= startDate);
      
        if(el?.dayNumber >= startDate && el?.dayNumber <= endDate){
          el.option = rosterValue 
        }
    }); 
    this.sendMessage()
    console.log(this.rosterData);
    
  }



  sendMessage() { 
    let modifiedRoster = {
      _id: this.rosterObjectId,
      roster: this.rosterData
    }  
    this.socket.emit('userRosterUpdate', modifiedRoster);
    this.getNewMessage()
    
  }

   getNewMessage(){
    this.socket.on('userRosterUpdate', (message) =>{
      this.message$.next(message); 
    });
    
    return this.message$.asObservable();
  };


  logOutAdmin(){
      localStorage.removeItem('admin')
      localStorage.removeItem('token')
      localStorage.clear()
      location.reload()
  }

  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }
}
