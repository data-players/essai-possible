import {createSlice, isAnyOf} from "@reduxjs/toolkit";
import api from "./api.js";
import {user, userToken} from "./auth-slice-data.js";

/**
 * AUTHENTICATION SLICE
 */

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    setCredentials: (state, {payload: {user, token}}) => {
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token); // Also persist token to local storage
    },
    setUser: (state, {payload: user}) => {
      state.user = user;
    },
    logOut: () => {
      localStorage.removeItem("token");
      return {user: null, token: null};
    },
  },
  extraReducers: (builder) => {
    builder
      // Set user and token after logIn and signup mutations
      .addMatcher(
        isAnyOf(api.endpoints.logIn.matchFulfilled, api.endpoints.signUp.matchFulfilled),
        slice.caseReducers.setCredentials
      )
      // Set user after fetch query
      .addMatcher(
        isAnyOf(api.endpoints.fetchUser.matchFulfilled, api.endpoints.updateUser.matchFulfilled),
        slice.caseReducers.setUser
      )
      // If there is any problem when fetching the user, log out the user
      .addMatcher(api.endpoints.fetchUser.matchRejected, slice.caseReducers.logOut);
  },
});

export const authActions = slice.actions;
export default slice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthTokenExists = (state) => !!state.auth.token;

/**
 * AUTHENTICATION API ENDPOINTS
 */
api.injectEndpoints({
  addTagTypes: ["User"],
  endpoints: (builder) => ({
    logIn: builder.mutation({
      query: () => "breeds?limit=100",
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
      invalidatesTags: ["User"],
    }),

    signUp: builder.mutation({
      query: () => "breeds?limit=100",
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
      invalidatesTags: ["User"],
    }),

    fetchUser: builder.query({
      query: () => "breeds?limit=10",
      // query: () => ({
      //   url: "user",
      //   method: "GET",
      // }),
      transformResponse() {
        // Mock data
        if (!localStorage.getItem("token")) throw Error("No token in local storage");
        return user;
      },
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (userPatch) => ({
        url: `user`,
        method: "PATCH",
        body: userPatch,
      }),
      transformResponse(baseQueryReturnValue, meta, userPatch) {
        // Mock data
        return {...user, ...userPatch};
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {useSignUpMutation, useLogInMutation, useLazyFetchUserQuery} = api;
