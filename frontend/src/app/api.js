import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {isAnyOf} from "@reduxjs/toolkit";

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
    baseUrl: "https://api.thedogapi.com/v1",
    prepareHeaders: (headers, {getState}) => {
      // By default, if we have a token in the store, add it to request headers
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  // Endpoints are defined in `xxx-slice.js` files
  // https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  endpoints: (builder) => ({}),
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
export const readySelector = (sliceName) => (state) => state[sliceName].status === "ready";

// Manages the status field properly and consistently for everybody.
export const addStatusForEndpoints = (builder, endpoints = []) => {
  const setStatusReducer = (status) => (state) => {
    state.status = status;
  };
  builder
    .addMatcher(matchAny("matchPending", endpoints), setStatusReducer("pending"))
    .addMatcher(matchAny("matchRejected", endpoints), setStatusReducer("idle"))
    .addMatcher(matchAny("matchFulfilled", endpoints), setStatusReducer("ready"));
};
