import {configureStore} from "@reduxjs/toolkit";
import api from "./api.js";
import apiMiddleware from "./apiMiddleware.js";
import geocodingApi from "./geocodingApi.js";
import offersReducer from "../routes/offers/offers-slice.js";
import companiesReducer from "../routes/offers/companies-slice.js";
import meetingsReducer from "../routes/offers/book/meetings-slice.js";
import slotsReducer from "../routes/offers/book/slots-slice.js";
import authReducer from "./auth-slice.js";

console.log('apiMiddleware',apiMiddleware);
console.log('api',api);
export const store = configureStore({
  reducer: {
    [geocodingApi.reducerPath]: geocodingApi.reducer,
    // [api.reducerPath]: api.reducer,
    [apiMiddleware.reducerPath]: apiMiddleware.reducer,
    auth: authReducer,
    offers: offersReducer,
    meetings: meetingsReducer,
    slots: slotsReducer,
    companies: companiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware.middleware, geocodingApi.middleware),
});
