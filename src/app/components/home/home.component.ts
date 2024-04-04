import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeadNavComponent } from '../head-nav/head-nav.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { LoginComponent } from '../login/login.component';
import { AdminDashboardComponent } from "../admin-section/admin-dashboard/admin-dashboard.component";
import { AdminNavComponent } from '../admin-section/admin-nav/admin-nav.component';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, DashboardComponent, HeadNavComponent, SideNavComponent, LoginComponent, AdminDashboardComponent, AdminNavComponent]
})
export class HomeComponent {
   @Input() userState!:string | null;
   navValue:any
   adminState:any 
   rosterState:any
   @Input() monthValue:any
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
  ngOnChanges(){
    console.log(this.adminState)
  }
  LogIn(userState:any){
    localStorage.removeItem('userState')
    console.log(userState)
    this.adminState = userState
    console.log(this.adminState)
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

  getSelectedMonth(month:any){ 
    this.monthValue = month
    console.log(this.monthValue); 
  }
}
 

