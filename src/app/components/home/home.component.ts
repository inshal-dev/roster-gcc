import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeadNavComponent } from '../head-nav/head-nav.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { LoginComponent } from '../login/login.component';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, DashboardComponent, HeadNavComponent, SideNavComponent, LoginComponent, AdminDashboardComponent]
})
export class HomeComponent implements OnInit{
   userState!:boolean;
   navValue:any
   adminState:any

  constructor(){
    let token = localStorage.getItem('myToken')
    //User token
    if(token){
      this.userState = false
    }else{
      this.userState = true
    }
  }

  ngOnInit(){

  }
  LogIn(userState:any){
    this.adminState = userState.admin
    console.log(this.adminState);

  }

  userNavInput(value:any){
    this.navValue = value
  }

  getNavDashboardValue(value:any){
    this.navValue = value 
  }
}
