import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GraphqlService,
  IncidentService,
} from '../../services/incident.service';

@Component({
  selector: 'app-incident-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incident-management.component.html',
  styleUrls: ['./incident-management.component.css'],
})
export class IncidentManagementComponent implements OnInit {
  incidents: IncidentService[] = [];
  loading = true;
  showCreateForm = false;
  showStatusUpdate = false;
  selectedIncident: IncidentService | null = null;
  errorMessage: string = '';

  newIncident = {
    title: '',
    type: 'ACCIDENT' as const,
    description: '',
    latitude: null as number | null,
    longitude: null as number | null,
    reportedById: 1,
    vehicleId: null as number | null,
  };

  incidentTypes = [
    { value: 'ACCIDENT', label: '🚗 Accident', color: '#ef4444', icon: '💥' },
    { value: 'ROADWORK', label: '🚧 Roadwork', color: '#f59e0b', icon: '🚧' },
    {
      value: 'ROAD_CLOSED',
      label: '⛔ Road Closed',
      color: '#dc2626',
      icon: '🚫',
    },
    {
      value: 'TRAFFIC_JAM',
      label: '🐌 Traffic Jam',
      color: '#eab308',
      icon: '🚙',
    },
  ];

  statusOptions = [
    { value: 'REPORTED', label: '📢 Reported', color: '#3b82f6' },
    { value: 'IN_PROGRESS', label: '⚙️ In Progress', color: '#f59e0b' },
    { value: 'RESOLVED', label: '✅ Resolved', color: '#10b981' },
  ];

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit() {
    this.loadIncidents();
  }

  loadIncidents() {
    this.loading = true;
    this.errorMessage = '';

    this.graphqlService.getIncidents().subscribe({
      next: (data) => {
        console.log('Loaded incidents:', data);
        this.incidents = data;
        this.loading = false;

        if (data.length === 0) {
          console.log('No incidents found in database');
        }
      },
      error: (error) => {
        console.error('Error loading incidents:', error);
        this.errorMessage =
          'Failed to load incidents. Please check your connection.';
        this.loading = false;
      },
    });
  }

  createIncident() {
    if (!this.newIncident.title) {
      console.error('Title is required');
      return;
    }

    if (!this.newIncident.reportedById) {
      console.error('ReportedBy ID is required');
      return;
    }

    const input = {
      title: this.newIncident.title,
      type: this.newIncident.type,
      reportedById: this.newIncident.reportedById,
      vehicleId: this.newIncident.vehicleId || undefined,
      latitude: this.newIncident.latitude || undefined,
      longitude: this.newIncident.longitude || undefined,
      description: this.newIncident.description,
    };

    console.log('Creating incident with input:', input);

    this.graphqlService.createIncident(input).subscribe({
      next: (response) => {
        console.log('Incident created successfully:', response);
        this.loadIncidents();
        this.resetForm();
        this.showCreateForm = false;
      },
      error: (error) => {
        console.error('Error creating incident:', error);
        this.errorMessage =
          'Failed to create incident. Please check your input.';
      },
    });
  }

  updateStatus(incident: IncidentService, newStatus: string) {
    console.log(`Updating incident ${incident.id} to status: ${newStatus}`);

    this.graphqlService.updateIncidentStatus(incident.id, newStatus).subscribe({
      next: (response) => {
        console.log('Status updated successfully:', response);
        this.loadIncidents();
        this.closeStatusModal();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.errorMessage = 'Failed to update incident status.';
      },
    });
  }

  openStatusModal(incident: IncidentService) {
    this.selectedIncident = incident;
    this.showStatusUpdate = true;
  }

  closeStatusModal() {
    this.showStatusUpdate = false;
    this.selectedIncident = null;
  }

  resetForm() {
    this.newIncident = {
      title: '',
      type: 'ACCIDENT',
      description: '',
      latitude: null,
      longitude: null,
      reportedById: 1,
      vehicleId: null,
    };
  }

  getIncidentTypeLabel(type: string): string {
    const found = this.incidentTypes.find((t) => t.value === type);
    return found ? found.label : type;
  }

  getIncidentTypeIcon(type: string): string {
    const found = this.incidentTypes.find((t) => t.value === type);
    return found ? found.icon : '📋';
  }

  getStatusLabel(status: string): string {
    const found = this.statusOptions.find((s) => s.value === status);
    return found ? found.label : status;
  }

  getStatusColor(status: string): string {
    const found = this.statusOptions.find((s) => s.value === status);
    return found ? found.color : '#6b7280';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'REPORTED':
        return 'status-reported';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'RESOLVED':
        return 'status-resolved';
      default:
        return '';
    }
  }

  getCoordinates(incident: IncidentService): string {
    if (incident.latitude && incident.longitude) {
      return `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`;
    }
    return 'No coordinates';
  }
}
