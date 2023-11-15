import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  url:string = 'http://localhost:3000/'
  constructor(
   private http:HttpClient
 ) { } 

 sendCurrentRoster(rosterData:any){
  console.log(rosterData);
  return this.http.post(this.url + 'current-roster', rosterData)
 }
 
}
