import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/AuthService';
import { UserRegister } from '../../Models/UserRegister';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage = "";
  registerData: UserRegister = new UserRegister();
  isInvalid: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private service: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  onRegister(form: any): void {
    try {
      this.isLoading = true;
      this.isInvalid = false;
      if (form.valid) {
        this.service.signup(this.registerData).subscribe({
          next: (data) => {
            this.isLoading = false;
            this.toastr.success('Registered successfully!', 'Success');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            this.isInvalid = true;
            this.errorMessage = error;
            console.error('Error Body:', error);
          }
        })
      } else {
        this.isLoading = false;
        this.errorMessage = "The given data is not valid";
        this.isInvalid = true;
      }
    } catch (error) {
      this.isLoading = false;
      console.error('Error Body:', error);
      this.toastr.error("Operation failed", 'Error');
    }
  }
}
