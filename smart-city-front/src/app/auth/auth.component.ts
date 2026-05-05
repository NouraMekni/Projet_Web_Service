import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  email = '';
  password = '';
  role = 'OPERATOR';
  isLogin = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.email = '';
    this.password = '';
  }

  submit() {
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    this.isLoading = true;

    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  register() {
    this.authService.register(this.email, this.password, this.role).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.isLogin = true;
        this.password = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed: ' + (err.message || 'Unknown error'));
        this.isLoading = false;
      },
    });
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const token = res?.data?.login;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('email', this.email);
          alert('Login successful!');
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Login failed: Invalid credentials');
        this.isLoading = false;
      },
    });
  }
}
