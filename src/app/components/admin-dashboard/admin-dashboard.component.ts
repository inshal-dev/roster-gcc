import { Component, Input } from '@angular/core';
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

  @Input() state!:any;

  rostersSubscription!: Subscription
  rosterData:any
  sel:any
  selectedUser!:UserRoster;
  date:Array<any> = [];
  startDate:number = 0;
  endDate:number = 0;
  rosterValue!:string;
  initial:number = 0;
  final: number = 15; 
  initialRoster : number = 0;
  finalRoster : number = 15
  rosterObjectId!:string;
  message$: BehaviorSubject<string> = new BehaviorSubject(''); 
  socket = io('http://localhost:3000');
  nullCount = 0
  apiResponse!:string;
  options:Array<string> = [
    "T1", "S1", "F3", "G2", "G1", "CO", "PH", "L", "WO"
  ]
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthCount: number = 0;
  constructor(
    private rosterService: RosterService, 
  ){
  }

  ngOnInit(){
    this.getRosterData()  
  }

  ngOnChanges(){ 
    
    if(this.state){
      this.submitRoster()
    }
    
  }

  getRosterData(){
    this.rostersSubscription = this.rosterService.getRosters().subscribe(
      (res) => {
        this.rosterData = res  
        console.log(this.rosterData);
        this.apiResponse = this.rosterData.res
        console.log(this.apiResponse);
        
        this.rosterObjectId = this.rosterData.data[0]._id 
        if(this.rosterData.res == 'pre-published'){ 
          this.rosterData = this.rosterData.data[0].roster
        }else{
          this.rosterData = this.rosterData.data
        } 
        //check this logic again 
          this.rosterData[0].roster.forEach((el:any) => {
           if(el?.dayNumber){
            this.date.push({
              date : el.dayNumber,
              day : el.weekday
            })
           }else{
            console.log('no data'); 
           } 
           if(el == null){
            this.nullCount += 1
           }else{
            this.monthCount += 1
           }
          })     
        return this.date 
       
      }
    )
  }

  submitRoster(){ 
    let data = {
      _id: this.rosterObjectId,
      roster: this.rosterData
    }
    if(this.apiResponse != '404'){
      this.rostersSubscription = this.rosterService.publishRoster(data).subscribe((res)=>{
        console.log('Roster Published'); 
      }, (err)=> console.log(err))
    }else{
      console.log("Nope can't do that")
    }
    
  }

  nextHalf(){
    this.initial = this.final;
    this.initialRoster = this.finalRoster + this.nullCount
    this.final = this.monthCount
    this.finalRoster = this.monthCount
  }
  prevHalf(){
    this.initial = 0;
    this.initialRoster = 0
    this.final = 15
    this.finalRoster = this.final
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
    this.endDate = this.startDate = 0
    this.rosterValue = ''
    
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
      return message
    });
    
    // return this.message$.asObservable();
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
