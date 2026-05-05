import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { ApolloClient } from '@apollo/client/core';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { InMemoryCache } from '@apollo/client/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClient.Options => {
        return {
          link: httpLink.create({
            uri: 'http://localhost:3000/graphql',
          }),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },

    Apollo,
  ],
};
