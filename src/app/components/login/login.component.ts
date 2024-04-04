import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { Toast } from 'bootstrap'; 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  @ViewChild('loginToast')
  myToast!: ElementRef;
  
  userLoginData!: Subscription;
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    passwd: new FormControl('', [Validators.required])
  })

  response:any;
  errorMessage:any;
  passwordError!:Object;

  authSubs!:Subscription;
  constructor(
   private authService: AuthService,
    private readonly router: Router
    ){
   }

  userState: boolean = true;
  @Output() authState = new EventEmitter<any>();

  ngOnInit(): void {
  }
  
  LogIn(){ 
    localStorage.clear()
    if(this.userForm.valid){
      this.userLoginData = this.authService.userLogin(this.userForm.value).subscribe((res:any)=>{

        localStorage.setItem('myToken', res.token);
        localStorage.setItem('myID', res.userId)
        localStorage.setItem('userName', res.username);
        let admin = res.admin
        if(admin = false){
          this.response = 'Logged as User'
        }else{
          this.response = 'Logged as Admin'
        }
        const toastElement = this.myToast.nativeElement;
        const bootstrapToast = new Toast(toastElement);
        bootstrapToast.show();
      
        this.authState.emit(admin)
       
       
        console.log('User Token is created');

      }, (err) => {
        this.passwordError = err.error 
        this.passwordError = Object.values(this.passwordError)
        console.log(Object.values(this.passwordError)); 
      })
    }

  }

  ngOnDestroy(){
    this.userLoginData.unsubscribe()
  }


}
