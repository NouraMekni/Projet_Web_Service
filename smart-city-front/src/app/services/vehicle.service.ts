import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  constructor(private apollo: Apollo) {}

  // 🔐 helper to get auth headers
  private getAuthHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }

  getVehicles(): Observable<any> {
    return this.apollo.query({
      query: gql`
        query GetVehicles {
          vehicles {
            id
            brand
            model
            licensePlate
            status
            ownerId
          }
        }
      `,
      fetchPolicy: 'network-only',
    });
  }

  getVehicle(id: number): Observable<any> {
    return this.apollo.query({
      query: gql`
        query GetVehicle($id: Int!) {
          vehicle(id: $id) {
            id
            brand
            model
            licensePlate
            status
            ownerId
          }
        }
      `,
      variables: { id },
    });
  }

  createVehicle(
    brand: string,
    model: string,
    licensePlate: string,
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation CreateVehicle(
          $brand: String!
          $model: String!
          $licensePlate: String!
        ) {
          createVehicle(
            brand: $brand
            model: $model
            licensePlate: $licensePlate
          ) {
            id
            brand
            model
            licensePlate
            status
            ownerId
          }
        }
      `,
      variables: {
        brand,
        model,
        licensePlate,
      },
      context: this.getAuthHeaders(),
    });
  }

  updateVehicle(
    id: number,
    brand: string,
    model: string,
    licensePlate: string,
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateVehicle(
          $id: Int!
          $brand: String!
          $model: String!
          $licensePlate: String!
        ) {
          updateVehicle(
            id: $id
            brand: $brand
            model: $model
            licensePlate: $licensePlate
          ) {
            id
            brand
            model
            licensePlate
            status
          }
        }
      `,
      variables: {
        id,
        brand,
        model,
        licensePlate,
      },
      context: this.getAuthHeaders(),
    });
  }

  deleteVehicle(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteVehicle($id: Int!) {
          deleteVehicle(id: $id)
        }
      `,
      variables: { id },
      context: this.getAuthHeaders(),
    });
  }

  addPosition(vehicleId: number, lat: number, lng: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddPosition($vehicleId: Int!, $lat: Float!, $lng: Float!) {
          addPosition(vehicleId: $vehicleId, lat: $lat, lng: $lng)
        }
      `,
      variables: {
        vehicleId,
        lat,
        lng,
      },
      context: this.getAuthHeaders(),
    });
  }

  getVehiclePositions(vehicleId: number): Observable<any> {
    return this.apollo.query({
      query: gql`
        query GetVehiclePositions($vehicleId: Int!) {
          vehicle(id: $vehicleId) {
            id
            positions {
              id
              latitude
              longitude
              timestamp
            }
          }
        }
      `,
      variables: { vehicleId },
    });
  }
}
