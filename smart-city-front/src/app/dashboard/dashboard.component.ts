import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userEmail: string | null = null;
  stats = [
    { label: 'Total Users', value: '1,234', icon: '👥', change: '+12%' },
    { label: 'Active Incidents', value: '23', icon: '⚠️', change: '-5%' },
    { label: 'Traffic Flow', value: '87%', icon: '🚦', change: '+3%' },
    { label: 'Response Time', value: '2.4min', icon: '⏱️', change: '-15%' },
  ];

  recentActivities = [
    { action: 'New user registered', time: '5 minutes ago', type: 'user' },
    { action: 'Incident #123 resolved', time: '1 hour ago', type: 'incident' },
    { action: 'Traffic pattern updated', time: '3 hours ago', type: 'traffic' },
    {
      action: 'System maintenance scheduled',
      time: '5 hours ago',
      type: 'system',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/auth']);
    }
  }

  // ✅ Add this missing method
  getActivityIcon(type: string): string {
    switch (type) {
      case 'user':
        return '👤';
      case 'incident':
        return '⚠️';
      case 'traffic':
        return '🚦';
      case 'system':
        return '🔧';
      default:
        return '📝';
    }
  }

  navigateTo(route: string) {
    // Add navigation logic for different sections
    alert(`Navigating to ${route} - Feature coming soon!`);
  }
}
