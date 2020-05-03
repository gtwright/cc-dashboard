import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/link-context";
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

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE1ODg0NjAyMjMsImF1ZCI6WyJodHRwczovL2FwaS11cy1lYXN0LTEuZ3JhcGhjbXMuY29tL3YyL2NrOW5mYzdjOTA3aDEwMXo1YXB5Y2Q0eTUvbWFzdGVyIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiMzI5ZDMyYTktM2Q4Yy00NDQ5LWFhMzUtYmQ5NmUxZTJhZmZmIiwianRpIjoiY2s5cTg3Y2NnMHkwYzAxeHQ2MWRjZTc2YiJ9.4paYuTpwnyuVUxIEFtWi69wHrI35kMjxmdcUMhUMuUtWKQG_VNkN5zHRPIqjqPdAvY-LFeZDSqgExnrBqWIYuPnlkomtXODRda_uKp3TIhLNrTF1cuJl-PXXBt7-sYgGWfZ1vMVv-SABT0vBPKLOqDX8DX1z8yDwAj8jfXZxXOFm3fVyy7wUPvfl9d79GJRbOYKwjIHlaKKm5z7NyPtLxOjT1PPeqqX-x7s4sGBl-H5jjRixt-pJvw0JB3R-USCO5sUR_rUlqifRba-1rLVx0y_FpDEOr5Svhu3pkLCZYaF6-8Gg2e6xAyrdYBScc4KmbClLJCdrtynsum-iB9qlgPhUry1mo30zbLZ2dizZiwsOE3oUGEH_vw3dbbZHDo5Cj2AIzC6UuzbVJyFvzfWEZaH5Dz8-xSfiiFFkhd-_oLkUiKg5zjuFwEWV4W3x_WCbskw1D6IIJiKQ3oV7f0KOfgwgRsh94t21EJaScoi60imShCwEHFnyYIgl9vOdirtetGVdiYyX36n8d0PAyW7oQf7mXjexunFYZU7Drqe2ISVTEBzZeqEhrmCeY7aOy3LdigSrf6oC0w0nSbHqZXC0F7itkuJqjlXGayd9CmFx2YkGe1vpHJF566V4W2ktZhU5N4Zjfl-sYo7hPfBH9UGgNEy1m02pLXBHDhO7KuMjDAA";
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    ssrMode: Boolean(ctx),
    connectToDevTools: true,
    link: ApolloLink.from([restLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache().restore(initialState),
    headers: {
      authorization: "Bearer ",
    },
  });
}
