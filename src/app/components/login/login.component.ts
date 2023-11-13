import { Component, EventEmitter, Output } from '@angular/core';
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
  LogIn(userState:boolean){   
    console.log(userState);
    
    this.authState.emit(userState) 
    
  }

  ngOnDestroy(){
  }

}
