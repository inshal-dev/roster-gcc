import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterService } from '../../../services/roster.service';

@Component({
  selector: 'app-publish-roster-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publish-roster-user.component.html',
  styleUrl: './publish-roster-user.component.scss'
})
export class PublishRosterUserComponent {
  userId!:string | any;
  constructor(
    private rosterService : RosterService
  ){
    this.userId = localStorage.getItem('myID')
    this.getMyRoster()
  }

  getMyRoster(){
    this.rosterService.getPublishRosterUser(this.userId).subscribe(
      res => console.log(res)
    )
  }


}
