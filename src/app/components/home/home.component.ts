import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeadNavComponent } from '../head-nav/head-nav.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DashboardComponent, HeadNavComponent, SideNavComponent, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userState:boolean = true;

  LogIn(userState:any){
    this.userState = userState

    console.log(this.userState);

  }
}
