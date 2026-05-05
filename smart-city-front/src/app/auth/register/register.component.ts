import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  role = 'OPERATOR';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    this.isLoading = true;

    this.authService.register(this.email, this.password, this.role).subscribe({
      next: (res: any) => {
        console.log('Registration response:', res);
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Registration failed: ' + (err.message || 'Unknown error'));
        this.isLoading = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
