import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    if (!this.email.trim() || !this.password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const login = res?.data?.login;

        const token = login?.access_token;
        const role = login?.role;
        const email = login?.email;

        if (!token || !role) {
          alert('Login failed');
          this.isLoading = false;
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);

        this.router.navigate([
          role === 'ADMIN' ? '/admin-dashboard' : '/operator-dashboard',
        ]);

        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        alert('Login error');
        this.isLoading = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
