import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {isAnyOf} from "@reduxjs/toolkit";
import * as path from "path";

/**
 * API OBJECT
 *
 * The Redux Toolkit's api object has the role of managing api calls to the server and the caching,
 * requests statuses, prefetching and other API related issues.
 * Here you'll find all the API endpoints of the server and their associated configurations.
 *
 * The api object does not properly manage the Redux state (though you could use it as it is, but gives a solid ground to build on it.
 * The result of API queries is then saved in the proper Redux slices (see the `xxxx-slice.js` files).
 */
const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    // baseUrl : import.meta.env.VITE_MIDDLEWARE_URL,
    prepareHeaders: (headers, {getState}) => {
      // By default, if we have a token in the store, add it to request headers
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  // Endpoints are defined in `xxx-slice.js` files
  // https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  endpoints: () => ({}),
});

export const {usePrefetch} = api;
export default api;

/**
 * REDUX UTILS
 */

// Shorthand for extraReducers definition
export const matchAny = (matcherKey, endpoints = []) =>
  isAnyOf(...endpoints.map((endpoint) => api.endpoints[endpoint][matcherKey]));

// Shorthand for status related selector
export const readySelector = (sliceName, apiEndpointName) => (state) =>
  state[sliceName].status[apiEndpointName] === "ready";

// Manages the status field properly and consistently for everybody.
export const addStatusForEndpoints = (builder, endpoints = []) => {
  const setStatusReducer = (status, endpoint) => (state) => {
    state.status[endpoint] = status;
  };
  for (const endpoint of endpoints) {
    // console.log('endpoint',endpoint);
    // console.log('endpoints',api.endpoints);
    // console.log('api.endpoints[endpoint]',api.endpoints[endpoint]);
    builder
      .addMatcher(api.endpoints[endpoint].matchPending, setStatusReducer("pending", endpoint))
      .addMatcher(api.endpoints[endpoint].matchRejected, setStatusReducer(undefined, endpoint))
      .addMatcher(api.endpoints[endpoint].matchFulfilled, setStatusReducer("ready", endpoint));
  }
};

/**
 * API UTILS
 */

export function baseUpdateMutation(marshaller) {
  return (patch) => ({
    url: decodeURIComponent(patch.id),
    method: "PUT",
    body: marshaller.unmarshall(patch),
  });
}

export function baseFetchEntitiesQuery(endpoint) {
  return (fetchParams = {}) => ({
    url: path.join(import.meta.env.VITE_MIDDLEWARE_URL, endpoint),
    ...fetchParams,
  });
}
