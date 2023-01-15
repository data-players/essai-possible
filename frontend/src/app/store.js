import {configureStore} from "@reduxjs/toolkit";
import api from "./api.js";
import offersReducer from "../routes/offers/offers-slice.js";
import authReducer from "./auth-slice.js";
import {useEffect} from "react";
import {useDispatch} from "react-redux";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    offers: offersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export function useDispatchOnMount(action, deps = []) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(action);
  }, [dispatch, action, ...deps]);
}
