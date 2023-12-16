import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RosterService } from '../../services/roster.service';
import { Subscribable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';

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

  options:Array<string> = [
    "T1", "S1", "F3", "G2", "G1"
  ]
  constructor(
    private rosterService: RosterService,
   private route: Router
  ){
  }

  ngOnInit(){
    this.getRosterData()
  }

  ngOnChanges(){
    console.log(this.sel);

  }

  getRosterData(){
    this.rostersSubscription = this.rosterService.getRosters().subscribe(
      (res) => {
        this.rosterData = res
        console.log(this.rosterData);
      }
    )
  }

  logOutAdmin(){
      localStorage.removeItem('admin')
      localStorage.removeItem('token')
      localStorage.clear()
      location.reload()
  }
}
