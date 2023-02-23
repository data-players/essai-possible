import {configureStore} from "@reduxjs/toolkit";
import apiMiddleware from "./apiMiddleware.js";
import geocodingApi from "./geocodingApi.js";
import {default as offersReducer} from "../routes/offers/offers-slice.js";
import {default as companiesReducer} from "../routes/offers/companies-slice.js";
import meetingsReducer from "../routes/offers/book/meetings-slice.js";
import slotsReducer from "../routes/offers/book/slots-slice.js";
import authReducer from "./auth-slice.js";
import {skillReducer, statusReducer, goalsReducer,sectorReducer} from "./concepts-slice.js";

export const store = configureStore({
  reducer: {
    [geocodingApi.reducerPath]: geocodingApi.reducer,
    // [api.reducerPath]: api.reducer,
    [apiMiddleware.reducerPath]: apiMiddleware.reducer,
    auth: authReducer,
    offers: offersReducer,
    skills: skillReducer,
    status : statusReducer,
    meetings : meetingsReducer,
    goals : goalsReducer,
    slots: slotsReducer,
    companies: companiesReducer,
    sectors: sectorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware.middleware, geocodingApi.middleware),
});
