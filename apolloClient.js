import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import { RestLink } from "apollo-link-rest";
// import fetch from "isomorphic-unfetch";
import clientFetch from "unfetch";
import serverFetch, { Headers as ServerHeaders } from "node-fetch";

export default function createApolloClient(initialState, ctx) {
  const client = typeof document !== "undefined";
  global.Headers = client ? global.Headers : ServerHeaders;
  const customFetch = client ? clientFetch : serverFetch;

  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URI,
    credentials: "same-origin",
    fetch: customFetch,
  });

  const restLink = new RestLink({
    uri: "https://covidtracking.com/api/v1/",
    // uri: "https://api.tvmaze.com/",

    customFetch,
  });

  return new ApolloClient({
    ssrMode: Boolean(ctx),
    connectToDevTools: true,
    link: ApolloLink.from([restLink, httpLink]),
    cache: new InMemoryCache().restore(initialState),
  });
}
