"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const apollo_client_1 = require("apollo-client");
const apollo_link_1 = require("apollo-link");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const apollo_link_http_1 = require("apollo-link-http");
const node_fetch_1 = require("node-fetch");
function handleAuthentication(operation, forward) {
    let extendedHeaders = {};
    // Token 
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTE0ODAwODAwfQ.PbiOFB91HTI7NbaBUXl2XilyUZmHarf89Xr2s03VjUI';
    extendedHeaders['Authorization'] = `Bearer ${token}`;
    // Finally
    operation.setContext(({ headers }) => ({ headers: Object.assign({}, headers, extendedHeaders) }));
    return forward(operation);
}
function createClient() {
    const link = new apollo_link_http_1.HttpLink({
        uri: 'http://192.168.1.120:3000/graphql',
        fetch: node_fetch_1.default,
    });
    const authLink = new apollo_link_1.ApolloLink((operation, forward) => handleAuthentication(operation, forward));
    return new apollo_client_1.default({
        link: apollo_link_1.ApolloLink.from([authLink, link]),
        cache: new apollo_cache_inmemory_1.InMemoryCache()
    });
}
let reporter = new _1.HealthReporter({
    name: 'worker',
    client: createClient()
});
reporter.start();
//# sourceMappingURL=demo.js.map