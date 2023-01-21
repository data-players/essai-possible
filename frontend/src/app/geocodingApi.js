import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react/index.js";

const geocodingApi = createApi({
  reducerPath: "geocodingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api-adresse.data.gouv.fr/search",
    mode: "cors",
  }),
  // Endpoints are defined in `xxx-slice.js` files
  // https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  endpoints: (builder) => ({
    fetchGeocodingSuggestions: builder.query({
      query: (text) => ({url: "/", params: {q: text, autocomplete: 1}}),
      transformResponse(baseQueryReturnValue, meta, arg) {
        const res = baseQueryReturnValue.features.map(
          ({properties: {label, context, city}, geometry: {coordinates}}) => ({
            label,
            context,
            city,
            lat: coordinates[1],
            long: coordinates[0],
          })
        );
        return res;
      },
    }),
  }),
});
export default geocodingApi;
export const {useLazyFetchGeocodingSuggestionsQuery} = geocodingApi;
