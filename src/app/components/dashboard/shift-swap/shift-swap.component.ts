import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RosterService } from '../../../services/roster.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { SwapShift } from '../../../interface/swapShift';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shift-swap',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './shift-swap.component.html',
  styleUrl: './shift-swap.component.scss'
})
export class ShiftSwapComponent {
  user:Array<string> = []
  group:string= ""  
  userId!:string | null;
  nonSwapUser:Array<string> = ['Chandrashekhar Pande', 'Prasiddhkumar Yadav', 'Santosh Kumar Gupta', 'Sajit Pillai', 'Jayashankara K S']
  options:Array<string> = ["T7", "S1", "F3", "G2", "G1", "CO", "PH", "L", "WO"]
  shiftForm = new FormGroup({
    swapwithEmployee: new FormControl('', [Validators.required]),
    swapEmpShift: new FormControl('', [Validators.required]),
    month: new FormControl(''),
    swapShift: new FormControl('', [Validators.required]),
    userId: new FormControl(''),
    swapDate:new FormControl('', [Validators.required]),
    requesterName: new FormControl('')
  }) 

  moments: moment.Moment = moment().add(0, 'months')
  months:Array<string> = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  month!:string;
  swapSubscription!: Subscription;

  swapHistory: Array<SwapShift> = []; 
  username!: string | null;
  constructor(
    private rosterService: RosterService
  ){
  }

  ngOnInit(){ 
    this.userId = localStorage.getItem('myID');
    this.month = this.months[this.moments.month()] 
    this.username = localStorage.getItem('userName')
    setInterval(()=>{
      this.getUserSwapHistory()
    }, 1000)
   
  }

  getUserSwapHistory(){
    if(this.userId)
    this.swapSubscription = this.rosterService.userSwapHistory(this.userId).subscribe((res)=> {
      this.swapHistory = res  
    })
  }

  groupSelected(event:any){
    const selectElement = event.target as HTMLSelectElement;
    this.group = selectElement.value;  
    this.swapSubscription = this.rosterService.userListSwap(this.group).subscribe((res)=> {
      this.user = res    
      let username = localStorage.getItem('userName');
      //if user name is not null then push the value
      username ? this.nonSwapUser.push(username): ''  
      //filter out nonswapable users from list
      this.user = this.user.filter((el)=>  !this.nonSwapUser.includes(el)) 
    })
  }

  submitShiftSwap(){ 
    this.shiftForm.patchValue({'userId': this.userId, 'month': this.month, 'requesterName':this.username }) 
    console.log(this.shiftForm.value);
    
    return this.swapSubscription = this.rosterService.userSwapRequest(this.shiftForm.value).subscribe((res)=> {
  
      this.getUserSwapHistory()
      this.shiftForm.reset()
    })
  }


  ngOnDestory(){
    this.swapSubscription.unsubscribe()
  }

  
}
