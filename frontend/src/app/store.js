import {configureStore} from "@reduxjs/toolkit";
import api from "./api.js";
import offersReducer from "../routes/offers/offers-slice.js";
import meetingsReducer from "../routes/offers/book/meetings-slice.js";
import authReducer from "./auth-slice.js";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    offers: offersReducer,
    meetings: meetingsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});
