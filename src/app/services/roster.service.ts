import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { months } from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  url:string = 'https://roster-server.onrender.com/'
  //url:string = 'http://localhost:3000/'
  auth!:any;
  id:any
  constructor(
   private http:HttpClient
 ) { 
   this.auth = localStorage.getItem('myToken')
   this.id = localStorage.getItem('userName')
 }
 
 sendCurrentRoster(rosterData:any){
  // console.log(rosterData);
  
  return this.http.post(this.url + 'current-roster', rosterData)
 }
 getUserRosterbyIDMonth(userId:any, month:string ){
  let data = { userId : userId, month: month }
  return this.http.post(this.url + 'user-check', data)
 }
 getRosters(month:string):Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  this.auth,
     'id': this.id 
    })}; 
 // console.log(month);
  
  return this.http.post(this.url + 'rosters', { data: month }, httpOptions)
 }

 publishRoster(roster:any):Observable<any>{ 
  return this.http.post(this.url + 'publish-roster', {data: roster})
 }
  
 getPublishRosterUser(id:string, month:string):Observable<any>{
  return this.http.post(this.url + 'user-published-roster', {_id : id, month: month })
 }


 createUserRosters():Observable<any>{
  return this.http.get(this.url + 'create-user-rosters')
 }

 getRosterforDashboard(value:string):Observable<any>{
  return this.http.post(this.url + 'dash-roster', { month: value })
 }
  
}
