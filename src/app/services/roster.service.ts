import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  url:string = 'http://localhost:3000/'
  auth!:any;
  id:any
  constructor(
   private http:HttpClient
 ) { 
   this.auth = localStorage.getItem('myToken')
   this.id = localStorage.getItem('myID')
 }
 
 sendCurrentRoster(rosterData:any){
  return this.http.post(this.url + 'current-roster', rosterData)
 }
 sendUserId(userId:any){
  let data = { userId : userId }
  return this.http.post(this.url + 'user-check', data)
 }
 getRosters():Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({

     'Content-Type':  'application/json',

     'Authorization':  this.auth,
     'id': this.id

    })};
  return this.http.get(this.url + 'rosters', httpOptions)
 }

 publishRoster(roster:any):Observable<any>{ 
  return this.http.post(this.url + 'publish-roster', {data: roster})
 }
}
