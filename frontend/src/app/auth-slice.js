import {createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "./apiMiddleware.js";
import jwtDecode from "jwt-decode";
import {createJsonLDMarshaller} from "./utils.js";
import * as yup from "yup";
import {requiredEmail, requiredPhone, requiredString} from "./fieldValidation.js";
import {baseUpdateMutation} from "./api.js";

/**
 * AUTHENTICATION SLICE
 */

const slice = createSlice({
  name: "auth",
  initialState: {
    status: {}, // {endpoint: undefined | "pending" | "ready", endpoint2: undefined | "pending" | "ready"}
    user: null,
    token: localStorage.getItem("token") || null,
    webId: localStorage.getItem("token")?jwtDecode(localStorage.getItem("token")).webId : null,
  },
  reducers: {
    setToken: (state, {payload}) => {
      localStorage.setItem("token", payload); // Also persist token to local storage
      const tockenData = jwtDecode(payload);
      state.webId = tockenData.webId;
      state.token = payload;


    },
    setCredentials: (state, {payload: {user, token}}) => {
      state.user = user;
      // state.token = token;
      // localStorage.setItem("token", token); // Also persist token to local storage
    },
    setUser: (state, {payload: user}) => {
      state.user = user;
    },
    logOut: (state) => {
      state.user = null;
      // state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(matchAny("matchFulfilled", ["fetchUser"]), slice.caseReducers.setUser)
      // If there is any problem with those ops the user, log out the user
      .addMatcher(matchAny("matchRejected", ["fetchUser"]), slice.caseReducers.logOut)
      .addMatcher(matchAny("matchFulfilled", ["deleteUser"]), slice.caseReducers.logOut);

    addStatusForEndpoints(builder, ["fetchUser"]);
  },
});

export const authActions = slice.actions;
export default slice.reducer;

/**
 * AUTHENTICATION SELECTORS
 */

export const selectCurrentUserReady = readySelector("auth", "fetchUser");

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthTokenExists = (state) => state.auth.token != undefined;

/**
 * AUTHENTICATION API ENDPOINTS
 */

const userMarshaller = createJsonLDMarshaller(
  {
    email: "pair:e-mail",
    firstName: "pair:firstName",
    lastName: "pair:lastName",
    companies: "pair:affiliatedBy",
  },
  {objectArrayFields: ["companies"]}
);

api.injectEndpoints({
  endpoints: (builder) => ({
    fetchUser: builder.query({
      queryFn: async (arg, {getState}, extraOptions, baseQuery) => {
        const webId= getState().auth.webId;
        const result = await baseQuery(webId);
        return {data: userMarshaller.marshall(result.data)}
      },
    }),

    updateUser: builder.mutation({
      query: baseUpdateMutation(userMarshaller),
      // transformResponse: userMarshaller.marshall,
    }),

    deleteUser: builder.mutation({
      query: () => "/users",
      // query: () => ({
      //   url: `user`,
      //   method: "DELETE",
      // }),
      transformResponse(baseQueryReturnValue, meta, id) {
        // Mock data
        return id;
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useLogInMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useFetchUserQuery,
  useLazyFetchUserQuery,
} = api;

/**
 * ATUH FORM UTILS
 */

export const userValidationSchema = yup.object({
  firstName: requiredString,
  lastName: requiredString,
  phone: requiredPhone,
  email: requiredEmail,
});

export const userDefaultValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};
