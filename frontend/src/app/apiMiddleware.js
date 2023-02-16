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
    // baseUrl: "https://api.thedogapi.com/v1",
    baseUrl: import.meta.env.VITE_MIDDLEWARE_URL,
    prepareHeaders: (headers, {getState}) => {
      // By default, if we have a token in the store, add it to request headers
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("accept", "application/ld+json");
      // headers.set("content-type", "application/ld+json");
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
    builder
      .addMatcher(api.endpoints[endpoint].matchPending, setStatusReducer("pending", endpoint))
      .addMatcher(api.endpoints[endpoint].matchRejected, setStatusReducer(undefined, endpoint))
      .addMatcher(api.endpoints[endpoint].matchFulfilled, setStatusReducer("ready", endpoint));
  }
};

/**
 * API UTILS
 */

// export function baseUpdateMutation(marshaller) {
//   return (patch) => ({
//     url: decodeURIComponent(patch.id),
//     method: "PUT",
//     body: marshaller.unmarshall(patch),
//   });
// }

export function baseUpdateMutation(marshaller) {
  const func = async (args, {getState}, extraOptions, baseQuery) => {
    const body = marshaller.unmarshall(args);
    await baseQuery({
      url: body.id,
      method: "PUT",
      body: body,
    });
    const data = (await baseQuery(body.id)).data;
    const marshallData = marshaller.marshall(data);
    return {data: marshallData};
  };
  return func;
}

export function baseCreateMutation(marshaller, container) {
  const func = async (args, {getState}, extraOptions, baseQuery) => {
    const body = marshaller.unmarshall(args);
    // console.log('baseCreateMutation body POST',body)
    body.id=undefined;
    body['@context']="https://data.essai-possible.data-players.com/context.json"
    const postResponse = await baseQuery({
      url: container,
      method: "POST",
      body: body,
    });
    if(postResponse.error==undefined){
      const status = postResponse.meta.response.status;
      if (status==201){
        const newId = postResponse.meta.response.headers.get('location');
        const data = (await baseQuery(newId)).data;
        // console.log('baseCreateMutation body GET',data)
        const marshallData = marshaller.marshall(data);
        return {data: marshallData};
      } else {
        return {error: `bas status ${status}`};
      }

    } else {
      return {error: postResponse.error};
    }

  };
  return func;
}

export function baseDeleteMutation() {
  const func = async (args, {getState}, extraOptions, baseQuery) => {
    // const body = marshaller.unmarshall(args);
    // body.id=undefined;
    // body['@context']="https://data.essai-possible.data-players.com/context.json"
    const postResponse = await baseQuery({
      url: decodeURIComponent(args),
      method: "DELETE"
    });
    if(postResponse.error==undefined){
      return {data: `${args.id} removed`};

    } else {
      return {error: postResponse.error};
    }

  };
  return func;
}


export function baseFetchEntitiesQuery(endpoint) {
  return (fetchParams = {}) => ({
    url: path.join(import.meta.env.VITE_MIDDLEWARE_URL, endpoint),
    ...fetchParams,
  });
}
