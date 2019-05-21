import { HealthReporter } from "./";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

function handleAuthentication(operation, forward) {
  let extendedHeaders: any = {};

  // Token 
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTE0ODAwODAwfQ.PbiOFB91HTI7NbaBUXl2XilyUZmHarf89Xr2s03VjUI';
  extendedHeaders['Authorization'] = `Bearer ${token}`;

  // Finally
  operation.setContext(({ headers }) => ({ headers: {
    ...headers,
    ...extendedHeaders
  }}));
  return forward(operation);
}


function createClient(): ApolloClient<any> {
  const link = new HttpLink({ 
    uri: 'http://192.168.1.120:3000/graphql', 
    fetch, 
  });

  const authLink = new ApolloLink((operation, forward) => handleAuthentication(operation, forward));
  
  return new ApolloClient<any>({
    link: ApolloLink.from([ authLink, link ]),
    cache: new InMemoryCache()
  });
}

let reporter = new HealthReporter({
  name: 'worker',
  client: createClient()
});
reporter.start();