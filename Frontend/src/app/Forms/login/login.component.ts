import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/AuthService';
import { UserLogin } from '../../Models/UserLogin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: UserLogin = new UserLogin();
  inValidCredential: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private service: AuthService
  ) { }

  onLogin(form: any) {
    try {
      this.isLoading = true;
      this.inValidCredential = false;
      if (form.valid) {
        this.service.login(this.loginData).subscribe({
          next: (data) => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            this.inValidCredential = true;
            this.errorMessage = error ?? "Login failed";
            console.error('Error Body:', error);
          },
          complete: () => { this.isLoading = false; }
        })
      } else {
        this.isLoading = false;
        this.inValidCredential = true;
      }
    } catch (error) {
      this.isLoading = false;
      console.error('Error Body:', error);
      this.toastr.error("Operation failed", 'Error');
    }
  }
}
