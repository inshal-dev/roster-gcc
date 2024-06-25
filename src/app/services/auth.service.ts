import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 //\url:string = 'https://roster-server.onrender.com/'
  url:string = ''
   constructor(
    private http:HttpClient
  ) { 
    this.url = environment.apiURL
  }

  userLogin(data:any):Observable<any>{
    return this.http.post(this.url + 'user-login', data)
  }
 
}
