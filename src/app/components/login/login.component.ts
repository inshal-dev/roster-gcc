import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userLoginData!: Subscription;
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    passwd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(10)])
  })

  response:any;
  errorMessage:any;

  authSubs!:Subscription;
  constructor(
   private authService: AuthService,
    private readonly router: Router
    ){
   }

  userState: boolean = true;
  @Output() authState = new EventEmitter<boolean>();

  ngOnInit(): void {
  }
  LogIn(){    
    localStorage.clear()
    if(this.userForm.valid){
      this.userLoginData = this.authService.userLogin(this.userForm.value).subscribe((res:any)=>{
        localStorage.setItem('myToken', res.token);
        localStorage.setItem('myID', res.userId)
        this.authState.emit(false)
        console.log('User Token is created');
        
      })
    }
 
  }

  ngOnDestroy(){
    this.userLoginData.unsubscribe()
  }


}
