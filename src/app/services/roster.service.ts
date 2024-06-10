import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { months } from 'moment';
import { Observable } from 'rxjs';
import { SwapShift } from '../interface/swapShift';

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
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
  return this.http.post(this.url + 'current-roster', rosterData, httpOptions)
 }
 getUserRosterbyIDMonth(userId:any, month:string ){
  let data = { userId : userId, month: month }
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
  return this.http.post(this.url + 'user-check', data, httpOptions)
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

 publishRoster(data:any):Observable<any>{ 
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
  return this.http.post(this.url + 'publish-roster', {data: data}, httpOptions)
 }
  
 getPublishRosterUser(id:string, month:string):Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
  return this.http.post(this.url + 'user-published-roster', {_id : id, month: month }, httpOptions)
 }


 createUserRosters():Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
  return this.http.get(this.url + 'create-user-rosters', httpOptions)
 }

 getRosterforDashboard(value:string):Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
  return this.http.post(this.url + 'dash-roster', { month: value }, httpOptions)
 }
  
 unApprovedCountCheck():Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
    return this.http.get(this.url + 'count', httpOptions);
 }

 getCSVdata(data:Object):Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
  return this.http.post(this.url + 'toCSV', {data: data}, { ...httpOptions, responseType: 'text' })
 }

 userListSwap(group:string):Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
  return this.http.post(this.url + 'user-list', {group: group}, httpOptions)
 }
 userSwapRequest(swapData:Object):Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
    return this.http.post(this.url + 'user-swap-shift', {swapData: swapData}, httpOptions)
 }
 userSwapHistory(_id:string):Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
    return this.http.post(this.url + 'user-swap-history', {userId: _id}, httpOptions)
 }
 updateSwap(data:SwapShift):Observable<any>{
  const httpOptions = { 
    headers: new HttpHeaders({ 
     'Content-Type':  'application/json', 
     'Authorization':  `${this.auth}`
    })}; 
    return this.http.post(this.url + 'user-swap-update',{swapData: data}, httpOptions)
 }
}
