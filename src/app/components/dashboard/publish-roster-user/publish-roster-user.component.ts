import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterService } from '../../../services/roster.service';
import moment from 'moment';
import { DaysFormatterPipe } from '../../../pipes/days-formatter.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publish-roster-user',
  standalone: true,
  imports: [CommonModule, DaysFormatterPipe],
  templateUrl: './publish-roster-user.component.html',
  styleUrl: './publish-roster-user.component.scss', 
})
export class PublishRosterUserComponent {
  userId!:string | any;
  currentDate: moment.Moment = moment().add(1, 'months');
  userRosterData!:Array<Object> | any;
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  rosterLength!:number;
  errMessage!: string;
  @Input() month!: string;
  currentMonth = this.currentDate.format('MMMM'); 
  rostersSubscription!: Subscription;
 
  constructor(
    private rosterService : RosterService
  ){
    this.userId = localStorage.getItem('myID') 
   // console.log(this.month)
    setTimeout(()=>{
      this.getMyRoster()
    }, 10)
  }

  ngOnChanges(){  
    //console.log('changed called - ngonchanges')
    this.getMyRoster()
  }

  getMyRoster(){
    if(this.month == undefined){
      this.month = this.currentMonth
    }else{
     this.rostersSubscription = this.rosterService.getPublishRosterUser(this.userId, this.month).subscribe(
        res => {
          this.userRosterData = res 
          this.rosterLength = this.userRosterData?.data.length;
         // console.log(this.rosterLength);
          
          this.userRosterData = this.userRosterData?.data[0].roster
        //  console.log(this.userRosterData);
          //console.log('changed called')
         },
        // (err) => {
        //   this.errMessage = err.error.message
        // }
      )
    }
   
  }
  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }

}
