import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeadNavComponent } from '../head-nav/head-nav.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { LoginComponent } from '../login/login.component';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { AdminNavComponent } from '../admin-nav/admin-nav.component';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, DashboardComponent, HeadNavComponent, SideNavComponent, LoginComponent, AdminDashboardComponent, AdminNavComponent]
})
export class HomeComponent {
   userState!:string | null;
   navValue:any
   adminState:any 
   rosterState:any
  constructor(){  
    this.detechUserToken()
  
  }
 
 

  detechUserToken(){
    let token = localStorage.getItem('myToken')
    //User token
    if(token){
       this.userState = localStorage.getItem('userState')
    }else{
      this.userState = 'login'
    }

  }

  LogIn(userState:any){
    localStorage.removeItem('userState')
    this.adminState = userState
    if(this.adminState == false ){
      this.userState = 'dash'
      localStorage.setItem('userState', this.userState)
    }else if(this.adminState == true){
      this.userState = 'admin-dash'
      localStorage.setItem('userState', this.userState)
    }
    console.log(this.adminState);
     
  }

  userNavInput(value:any){
    this.navValue = value
  }

  getNavDashboardValue(value:any){
    this.navValue = value 
  }
  getPublishState(res:any){
    this.rosterState = res
  }
}
 

