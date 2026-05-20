import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IncidentService {
  id: number;
  title: string;
  type: 'ACCIDENT' | 'ROADWORK' | 'ROAD_CLOSED' | 'TRAFFIC_JAM';
  status: 'REPORTED' | 'IN_PROGRESS' | 'RESOLVED';
  latitude?: number;
  longitude?: number;
  description?: string;
  reportedById: number;
  vehicleId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  getIncidents(): Observable<IncidentService[]> {
    const GET_INCIDENTS = gql`
      query GetIncidents {
        incidents {
          id
          title
          type
          status
          latitude
          longitude
          description
          reportedById
          vehicleId
        }
      }
    `;

    return this.apollo
      .watchQuery<any>({
        query: GET_INCIDENTS,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result) => {
          console.log('GraphQL Response:', result.data);
          return result.data?.incidents || [];
        }),
      );
  }

  createIncident(input: {
    title: string;
    type: string;
    reportedById: number;
    vehicleId?: number;
    latitude?: number;
    longitude?: number;
    description?: string;
  }): Observable<IncidentService> {
    const CREATE_INCIDENT = gql`
      mutation CreateIncident(
        $title: String!
        $type: IncidentType!
        $reportedById: Int!
        $vehicleId: Int
        $latitude: Float
        $longitude: Float
        $description: String
      ) {
        createIncident(
          title: $title
          type: $type
          reportedById: $reportedById
          vehicleId: $vehicleId
          latitude: $latitude
          longitude: $longitude
          description: $description
        ) {
          id
          title
          type
          status
          latitude
          longitude
          description
          reportedById
          vehicleId
        }
      }
    `;

    return this.apollo
      .mutate<any>({
        mutation: CREATE_INCIDENT,
        variables: input,
        refetchQueries: [
          {
            query: gql`
              query GetIncidents {
                incidents {
                  id
                  title
                  type
                  status
                  latitude
                  longitude
                  description
                  reportedById
                  vehicleId
                }
              }
            `,
          },
        ],
      })
      .pipe(
        map((result) => {
          console.log('Create Incident Response:', result.data);
          return result.data?.createIncident;
        }),
      );
  }

  updateIncidentStatus(
    id: number,
    status: string,
  ): Observable<IncidentService> {
    const UPDATE_STATUS = gql`
      mutation UpdateIncidentStatus($id: Int!, $status: IncidentStatus!) {
        updateIncidentStatus(id: $id, status: $status) {
          id
          title
          type
          status
          latitude
          longitude
          description
          reportedById
          vehicleId
        }
      }
    `;

    return this.apollo
      .mutate<any>({
        mutation: UPDATE_STATUS,
        variables: { id, status },
        refetchQueries: ['GetIncidents'],
      })
      .pipe(
        map((result) => {
          console.log('Update Status Response:', result.data);
          return result.data?.updateIncidentStatus;
        }),
      );
  }
}
