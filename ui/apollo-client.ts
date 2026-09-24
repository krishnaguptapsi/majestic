import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

declare var PRODUCTION: boolean;

let WS_URL = "ws://localhost:4000/graphql";
let HTTP_URL = "http://localhost:4000/graphql";

console.log(`🔧 Apollo Client initializing (PRODUCTION: ${PRODUCTION})`);

if (PRODUCTION) {
  const WS_PROTOCOL = window.location.protocol === "https:" ? "wss:" : "ws:";
  WS_URL = `${WS_PROTOCOL}//${window.location.host}/graphql`;
  HTTP_URL = `${window.location.protocol}//${window.location.host}/graphql`;
  console.log(`✅ Production mode - using same-origin: ${HTTP_URL}`);
} else {
  // Development mode - use environment or explicit configuration
  const apiHost = window.location.hostname === "localhost" 
    ? "localhost:4000" 
    : `${window.location.hostname}:4000`;
  WS_URL = `ws://${apiHost}/graphql`;
  HTTP_URL = `http://${apiHost}/graphql`;
  console.log(`✅ Development mode - connecting to: ${HTTP_URL}`);
}

export function getAPIUrl() {
  return HTTP_URL;
}

console.log(`📡 Apollo Client URLs:`);
console.log(`   HTTP: ${HTTP_URL}`);
console.log(`   WebSocket: ${WS_URL}`);

// In dev mode (browser), WebSocket may not work reliably in all environments
// Use HTTP-only mode in dev, full WebSocket support in production
const useWebSocket = PRODUCTION;

let wsLink;
if (useWebSocket) {
  try {
    wsLink = new GraphQLWsLink(createClient({ 
      url: WS_URL,
      on: {
        connected: () => console.log("✅ WebSocket connected"),
        error: (err) => console.error("❌ WebSocket error:", err),
        closed: () => console.log("⚠️ WebSocket closed"),
      }
    }));
    console.log("✅ WebSocket link created");
  } catch (err) {
    console.error("❌ Failed to create WebSocket link:", err);
    wsLink = null;
  }
} else {
  console.log("⚠️ WebSocket disabled in development mode (using HTTP polling instead)");
  wsLink = null;
}

const httpLink = new HttpLink({ 
  uri: HTTP_URL, 
  credentials: "include",
  fetchOptions: {
    headers: {
      'Accept': 'application/json',
    },
  },
  fetch: (uri, options) => {
    console.log(`📤 Apollo HttpLink fetch: ${options?.method} to ${uri}`);
    return fetch(uri, options).then(res => {
      console.log(`📥 Apollo HttpLink response: ${res.status} ${res.statusText}`);
      if (!res.ok) {
        console.error(`❌ HTTP Error: ${res.status}`, res);
      }
      return res;
    }).catch(err => {
      console.error(`❌ Apollo fetch error:`, err);
      throw err;
    });
  }
});

const link = wsLink ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
) : httpLink;

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

console.log("✅ Apollo Client initialized successfully");

export default client;
