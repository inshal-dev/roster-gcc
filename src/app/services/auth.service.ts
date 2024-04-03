import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  //url:string = 'https://roster-server.onrender.com/'
  url:string = 'http://localhost:3000/'
   constructor(
    private http:HttpClient
  ) { }

  userLogin(data:any):Observable<any>{
    return this.http.post(this.url + 'user-login', data)
  }
}
