import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.css'],
})
export class VehicleManagementComponent implements OnInit {
  vehicles: any[] = [];
  showAddModal = false;
  showEditModal = false;
  showPositionModal = false;
  selectedVehicle: any = null;
  isLoading = false;

  newVehicle = {
    brand: '',
    model: '',
    licensePlate: '',
  };

  editVehicle = {
    id: null as number | null,
    brand: '',
    model: '',
    licensePlate: '',
  };

  position = {
    lat: 0,
    lng: 0,
  };

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.isLoading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (res: any) => {
        this.vehicles = res?.data?.vehicles || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vehicles:', err);
        alert('Failed to load vehicles');
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/operator-dashboard']);
  }

  openAddModal() {
    this.newVehicle = { brand: '', model: '', licensePlate: '' };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addVehicle() {
    if (
      !this.newVehicle.brand ||
      !this.newVehicle.model ||
      !this.newVehicle.licensePlate
    ) {
      alert('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    this.vehicleService
      .createVehicle(
        this.newVehicle.brand,
        this.newVehicle.model,
        this.newVehicle.licensePlate,
      )
      .subscribe({
        next: () => {
          alert('Vehicle added successfully!');
          this.closeAddModal();
          this.loadVehicles();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error adding vehicle:', err);
          alert('Failed to add vehicle');
          this.isLoading = false;
        },
      });
  }

  openEditModal(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.editVehicle = {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedVehicle = null;
  }

  updateVehicle() {
    if (
      !this.editVehicle.brand ||
      !this.editVehicle.model ||
      !this.editVehicle.licensePlate
    ) {
      alert('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    this.vehicleService
      .updateVehicle(
        this.editVehicle.id!,
        this.editVehicle.brand,
        this.editVehicle.model,
        this.editVehicle.licensePlate,
      )
      .subscribe({
        next: () => {
          alert('Vehicle updated successfully!');
          this.closeEditModal();
          this.loadVehicles();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating vehicle:', err);
          alert('Failed to update vehicle');
          this.isLoading = false;
        },
      });
  }

  deleteVehicle(id: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.isLoading = true;
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          alert('Vehicle deleted successfully!');
          this.loadVehicles();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting vehicle:', err);
          alert('Failed to delete vehicle');
          this.isLoading = false;
        },
      });
    }
  }

  openPositionModal(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.position = { lat: 0, lng: 0 };
    this.showPositionModal = true;
  }

  closePositionModal() {
    this.showPositionModal = false;
    this.selectedVehicle = null;
  }

  addPosition() {
    if (!this.position.lat || !this.position.lng) {
      alert('Please enter latitude and longitude');
      return;
    }

    this.isLoading = true;
    this.vehicleService
      .addPosition(
        this.selectedVehicle.id,
        this.position.lat,
        this.position.lng,
      )
      .subscribe({
        next: () => {
          alert('Position added successfully!');
          this.closePositionModal();
          this.loadVehicles();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error adding position:', err);
          alert('Failed to add position');
          this.isLoading = false;
        },
      });
  }
}
