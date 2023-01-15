import {createSlice} from "@reduxjs/toolkit";
import api from "./api.js";
import {user, userToken} from "./auth-slice-data.js";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";

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
    setUser: (state, {payload: user}) => {
      state.user = user;
    },
    setToken: (state, {payload: token}) => {
      state.token = token;
      localStorage.setItem("token", token); // Also persist in local storage
    },
    logOut: () => {
      localStorage.removeItem("token");
      return {user: null, token: null};
    },
  },
});

export const authActions = slice.actions;
export default slice.reducer;
export const selectCurrentUser = () => (state) => state.auth.user;

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

api.enhanceEndpoints({
  addTagTypes: ["User"],
});

export const {useSignUpMutation, useLogInMutation, useFetchUserQuery} = api;

/**
 * AUTHENTICATION UTILS
 */

export function useAutoLogin() {
  const dispatch = useDispatch();
  const [autoConnectDone, setAutoConnectDone] = useState(false);

  // Fetch the user. If the token is set, a user is given, else there is an error.
  const {
    data: fetchedUser,
    isLoading: userFetchLoading,
    error: userFetchError,
  } = useFetchUserQuery();

  // When the user is fetched, save it to the Redux store
  useEffect(() => {
    if (!autoConnectDone && !userFetchLoading && !userFetchError && fetchedUser) {
      dispatch(authActions.setUser(fetchedUser));
      setAutoConnectDone(true);
    }
  }, [autoConnectDone, dispatch, fetchedUser, userFetchError, userFetchLoading]);
}
