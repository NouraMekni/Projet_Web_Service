import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  register(email: string, password: string, role: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation Register($email: String!, $password: String!, $role: Role!) {
          register(email: $email, password: $password, role: $role) {
            id
            email
            role
          }
        }
      `,
      variables: {
        email,
        password,
        role,
      },
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            access_token
            email
            role
          }
        }
      `,
      variables: {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      },
    });
  }
}
