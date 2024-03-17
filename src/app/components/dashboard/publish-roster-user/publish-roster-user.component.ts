import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterService } from '../../../services/roster.service';
import moment from 'moment';
import { DaysFormatterPipe } from '../../../pipes/days-formatter.pipe';

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
 
  constructor(
    private rosterService : RosterService
  ){
    this.userId = localStorage.getItem('myID')
    this.month = this.currentDate.format('MMMM'); 
    this.getMyRoster()
     
  }

  ngOnChanges(){  
    console.log('changed called - ngonchanges')
    this.getMyRoster()
  }

  getMyRoster(){
    this.rosterService.getPublishRosterUser(this.userId, this.month).subscribe(
      res => {
        this.userRosterData = res 
        this.rosterLength = this.userRosterData?.data.length;
        console.log(this.rosterLength);
        
        this.userRosterData = this.userRosterData?.data[0].roster
        console.log(this.userRosterData);
        console.log('changed called')
       },
      // (err) => {
      //   this.errMessage = err.error.message
      // }
    )
  }


}
