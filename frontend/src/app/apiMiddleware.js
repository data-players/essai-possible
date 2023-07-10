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

// Shorthand for status related selector
export const stateSelector = (sliceName, apiEndpointName) => (state) =>
  state[sliceName].status[apiEndpointName];

// Manages the status field properly and consistently for everybody.
export const addStatusForEndpoints = (builder, endpoints = []) => {
  const setStatusReducer = (status, endpoint) => (state) => {
    state.status[endpoint] = status;
  };
  for (const endpoint of endpoints) {
    builder
      .addMatcher(api.endpoints[endpoint].matchPending, setStatusReducer("pending", endpoint))
      .addMatcher(api.endpoints[endpoint].matchRejected, setStatusReducer("error", endpoint))
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



export async function baseUpdateCore(args, marshaller, baseQuery, fetchMethod) {
  const body = marshaller.unmarshall(args);
  const existingData = (await baseQuery(body.id)).data;
  // console.log('body',body)
  const mixedBody = {
    ...existingData,
    ...body
  };
  // console.log('mixedBody',mixedBody)
  await baseQuery({
    url: body.id,
    method: "PUT",
    body: mixedBody,
  });
  let marshallData;
  if (fetchMethod){
    marshallData = await fetchMethod(body.id)
  } else {
    const data = (await baseQuery(body.id)).data;
    marshallData = marshaller.marshall(data);
  }
  // const data = (await baseQuery(body.id)).data;
  // const marshallData = marshaller.marshall(data);
  return { data: marshallData };
}

export function baseUpdateMutation(marshaller) {
  const func = async (args, {getState}, extraOptions, baseQuery) => {
    return await baseUpdateCore(args , marshaller, baseQuery);
  };
  return func;
}

export async function baseCreateCore(args, marshaller, baseQuery, container, context, fetchMethod) {
  const body = marshaller.unmarshall(args);
  body.id = undefined;
  body['@context'] = context;
  const postResponse = await baseQuery({
    url: container,
    method: "POST",
    body: body,
  });
  let out;
  if (postResponse.error == undefined) {
    const status = postResponse.meta.response.status;
    if (status == 201) {
      const newId = postResponse.meta.response.headers.get('location');
      let marshallData;
      if (fetchMethod){
        marshallData = await fetchMethod(newId)
      } else {
        const data = (await baseQuery(newId)).data;
        marshallData = marshaller.marshall(data);
      }

      out = { data: marshallData };
      // return {data: marshallData};
    } else {
      out = { error: `status ${status}` };
      // return {error: `status ${status}`};
    }

  } else {
    // return {error: postResponse.error};
    // console.log('postResponse',postResponse.meta.response.statusText)
    out = { error: {message : postResponse.meta?.response?.statusText || postResponse?.error }};
  }
  return out;
}

export function baseCreateMutation(marshaller, container, context) {
  const func = async (args, {getState}, extraOptions, baseQuery) => {
    return await baseCreateCore(args, marshaller, baseQuery, container, context);
  };
  return func;
}


export function baseDeleteMutation() {
  const func = async (args, {getState}, extraOptions, baseQuery) => {
    // const body = marshaller.unmarshall(args);
    // body.id=undefined;
    // body['@context']="https://data.essaipossible.fr/context.json"
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
