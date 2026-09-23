import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

declare var PRODUCTION: boolean;

let WS_URL = "ws://localhost:4000/graphql";
let HTTP_URL = "http://localhost:4000/graphql";

if (PRODUCTION) {
  const WS_PROTOCOL = window.location.protocol === "https:" ? "wss:" : "ws:";
  WS_URL = `${WS_PROTOCOL}//${window.location.host}/graphql`;
  HTTP_URL = `${window.location.protocol}//${window.location.host}/graphql`;
}

export function getAPIUrl() {
  return HTTP_URL;
}

const wsLink = new GraphQLWsLink(createClient({ url: WS_URL }));
const httpLink = new HttpLink({ uri: HTTP_URL });

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
