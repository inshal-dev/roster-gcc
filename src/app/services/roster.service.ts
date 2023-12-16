import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  url:string = 'http://localhost:3000/'
  constructor(
   private http:HttpClient
 ) { }

 sendCurrentRoster(rosterData:any){
  return this.http.post(this.url + 'current-roster', rosterData)
 }
 sendUserId(userId:any){
  let data = { userId : userId }
  return this.http.post(this.url + 'user-check', data)
 }
 getRosters():Observable<any>{
  return this.http.get(this.url + 'rosters')
 }
}
