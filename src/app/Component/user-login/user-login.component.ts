import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  
  constructor(private http: HttpClient, private router: Router) {}

  // Hardcoded user credentials (for demonstration purposes)
  private validEmail: string = 'user@gmail.com';
  private validPassword: string = 'user';

  onSubmit() {
    if (this.email === this.validEmail && this.password === this.validPassword) {
      // Store user authentication status in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/dashboard']);  // Redirect to dashboard after login
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }

  // onSubmit(using api) {
  //   const loginData = {
  //     email: this.email,
  //     password: this.password
  //   };
  //   this.http.post('https://demo-api-url.com/login', loginData).subscribe({
  //     next: (response: any) => {
  //       localStorage.setItem('token', response.token); // Assuming the API returns a token
  //       this.router.navigate(['/dashboard']); // Redirect to the dashboard
  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Invalid email or password';
  //     }
  //   });
  // }

}
