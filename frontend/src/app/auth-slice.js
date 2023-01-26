import {createSlice} from "@reduxjs/toolkit";
// import api, {addStatusForEndpoints, matchAny, readySelector} from "./api.js";
import api, {addStatusForEndpoints, matchAny, readySelector} from "./apiMiddleware.js";
import {user, userToken} from "./auth-slice-data.js";

/**
 * AUTHENTICATION SLICE
 */

const slice = createSlice({
  name: "auth",
  initialState: {
    status: {}, // {endpoint: undefined | "pending" | "ready", endpoint2: undefined | "pending" | "ready"}
    user: null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    setToken : (state, {payload}) => {
      console.log('auth-slice token',{payload: {path, token}});
      state.token = payload;
      localStorage.setItem("token", payload); // Also persist token to local storage
    },
    setCredentials: (state, {payload: {user, token}}) => {
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token); // Also persist token to local storage
    },
    setUser: (state, {payload: user}) => {
      state.user = user;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOG IN - SIGN UP : Set user and token after logIn and signup mutations
      .addMatcher(
        matchAny("matchFulfilled", ["logIn", "signUp"]),
        slice.caseReducers.setCredentials
      )
      // FETCH - UPDATE : Set user after fetch and update query
      .addMatcher(
        matchAny("matchFulfilled", ["fetchUser", "updateUser"]),
        slice.caseReducers.setUser
      )
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
export const selectAuthTokenExists = (state) => !!state.auth.token;

/**
 * AUTHENTICATION API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    logIn: builder.mutation({
      query: () => "auth",
      // query: ({email, password}) => ({
      //   url: "auth",
      //   method: "POST",
      //   body: {email, password},
      // }),
      transformResponse() {
        // Mock data
        return {
          token: userToken,
          user: user,
        };
      },
    }),

    signUp: builder.mutation({
      query: () => "auth",
      // query(initialUser) {
      //   return {
      //     url: "user",
      //     method: "POST",
      //     body: initialUser,
      //   };
      // },
      transformResponse() {
        // Mock data
        return {
          token: userToken,
          user: user,
        };
      },
    }),

    fetchUser: builder.query({
      query: () => "breeds?limit=100",
      // query: () => ({
      //   url: "user",
      //   method: "GET",
      // }),
      transformResponse() {
        // Mock data
        if (!localStorage.getItem("token")) throw Error("No token in local storage");
        return user;
      },
    }),

    updateUser: builder.mutation({
      query: () => "breeds?limit=100",
      // query: (userPatch) => ({
      //   url: `user`,
      //   method: "PATCH",
      //   body: userPatch,
      // }),
      transformResponse(baseQueryReturnValue, meta, userPatch) {
        // Mock data
        return {...user, ...userPatch};
      },
    }),

    deleteUser: builder.mutation({
      query: () => "breeds?limit=100",
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
