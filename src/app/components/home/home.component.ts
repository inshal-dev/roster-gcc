import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeadNavComponent } from '../dashboard/head-nav/head-nav.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { LoginComponent } from '../login/login.component';
import { AdminDashboardComponent } from "../admin-section/admin-dashboard/admin-dashboard.component";
import { AdminNavComponent } from '../admin-section/admin-nav/admin-nav.component';
import { AllViewDashboardComponent } from '../all-view-dashboard/all-view-dashboard.component';
import { SwapShift } from '../../interface/swapShift';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, DashboardComponent, HeadNavComponent, SideNavComponent, LoginComponent, AdminDashboardComponent, AdminNavComponent, AllViewDashboardComponent]
})
export class HomeComponent {
   @Input() userState!:string | null;
   @Input() monthValue:any
   navValue:any
   adminState:any 
   rosterState:any 
   prevState!: string | null;
    userCount:Array<string> = []
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
    this.adminState = userState 
    if(this.adminState == false ){
      this.userState = 'dash'
      localStorage.setItem('userState', this.userState)
    }else if(this.adminState == true){
      this.userState = 'admin-dash'
      localStorage.setItem('userState', this.userState)
    } 
     
  }

  userNavInput(value:any){
    this.navValue = value
  }

  getNavDashboardValue(value:any){
    this.navValue = value 
  }
  getPublishState(res:any){
    this.rosterState = res 
    console.log(this.rosterState);
    // setTimeout(()=>{
    //   this.getRouteForDashboard('all-dash')
    // }, 2000)
    
  }

  adminRoutetoDash($event:Event){ 
    this.getRouteForDashboard('all-dash')
  }
  getSelectedMonth(month:any){ 
    this.monthValue = month
    console.log(this.monthValue); 
  }

  getRouteForDashboard(route:string){ 
    if(route){
      this.prevState = this.userState
      this.userState = route 
    }
  } 
  getUserCountCheck(count:Array<string>){
    this.userCount = count
  } 

  routetoCurrentState(routeState:boolean){ 
    return routeState ? this.userState = this.prevState : console.log(this.userState)
  }
}
 

