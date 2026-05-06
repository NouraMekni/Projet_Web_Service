import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operator-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operator-dashboard.component.html',
  styleUrls: ['./operator-dashboard.component.css'],
})
export class OperatorDashboardComponent {
  constructor(private router: Router) {}

  goToVehicles() {
    this.router.navigate(['/operator/vehicles']);
  }

  goToIncidents() {
    this.router.navigate(['/operator/incidents']);
  }
}
