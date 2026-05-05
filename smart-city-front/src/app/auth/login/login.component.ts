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
        const token = res?.data?.login;

        if (!token) {
          alert('Login failed: No token received');
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('email', this.email);

        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.error('Login error:', err);

        const message =
          err?.graphQLErrors?.[0]?.message ||
          'Invalid credentials or server error';

        alert(message);
      },

      complete: () => {
        this.isLoading = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
