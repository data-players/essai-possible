import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {fullOffers, lightOffersList} from "../routes/offers/offers-slice-data.js";

// The Redux Toolkit's api object has the role of managing api calls to the server and the caching,
// requests statuses, prefetching and other API related issues.
// Here you'll find all the API endpoints of the server and their associated configurations.
//
// The api object does not properly manage the Redux state (though you could use it as it is, but gives a solid ground to build on it.
// It is then connected to Redux slices through async thunks (see the `xxxxxx-slice.js` files for example).

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.thedogapi.com/v1",
    prepareHeaders: (headers, {getState}) => {
      // By default, if we have a token in the store or in the local storage, let's use that for authenticated requests
      const token = getState().auth.token;
      console.log("Request:", token);
      if (token) headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Fetch the list of all offers
    fetchOffers: builder.query({
      query() {
        return `/breeds?limit=1`;
      },
      transformResponse() {
        // Mock data with offers
        return lightOffersList;
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one offer by id
    fetchOffer: builder.query({
      query(id) {
        return `/breeds?limit=10`;
      },
      transformResponse(baseQueryReturnValue, meta, id) {
        // Mock data with offers
        return fullOffers.find((offer) => offer.id === id);
      },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});

export const {usePrefetch, useFetchOffersQuery, useFetchOfferQuery} = api;
export default api;
