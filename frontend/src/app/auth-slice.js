import {createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "./apiMiddleware.js";
import {users} from "./auth-slice-data.js";
import jwtDecode from "jwt-decode";

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
      console.log("setUser", user);
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
      // LOG IN - SIGN UP : Set user and token after logIn and signup mutations
      // .addMatcher(
      //   matchAny("matchFulfilled", ["logIn", "signUp"]),
      //   slice.caseReducers.setCredentials
      // )
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
export const selectAuthTokenExists = (state) => {
  // console.log('selectAuthTokenExists',state.auth);
  return state.auth.token != undefined;
};

/**
 * AUTHENTICATION API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    // logIn: builder.mutation({
    //   query: () => "breeds?limit=100",
    //   // query: () => {
    //   //   return {
    //   //   url: "auth",
    //   //   method: "POST",
    //   //   body: {email, password},
    //   //   }
    //   // },
    //   transformResponse(a, b, id) {
    //     // Mock data
    //     const user = users.find((user) => user.id === id);
    //     return {
    //       token: user.token,
    //       user,
    //     };
    //   },
    // }),
    //
    // signUp: builder.mutation({
    //   query: () => "breeds?limit=100",
    //   // query(initialUser) {
    //   //   return {
    //   //     url: "user",
    //   //     method: "POST",
    //   //     body: initialUser,
    //   //   };
    //   // },
    //   transformResponse(a, b, id) {
    //     // Mock data
    //     const user = users.find((user) => user.id === id);
    //     return {
    //       token: user.token,
    //       user,
    //     };
    //   },
    // }),

    fetchUser: builder.query({
      queryFn: async (arg, {getState}, extraOptions, baseQuery) => {
        const webId= getState().auth.webId;
        const result = await baseQuery(webId);
        const data = result.data
        return {
          data:{
            id: data.id,
            email: data["pair:e-mail"],
            firstName: data["pair:firstName"],
            lastName: data["pair:lastName"],
            companies: Array.isArray(data["pair:affiliatedBy"])
              ? data["pair:affiliatedBy"]
              : [data["pair:affiliatedBy"]],
          }
        };
      },
    }),

    updateUser: builder.mutation({
      query: () => "/users",
      // query: (userPatch) => ({
      //   url: `user`,
      //   method: "PATCH",
      //   body: userPatch,
      // }),
      transformResponse(baseQueryReturnValue, meta, userPatch) {
        // Mock data
        const user = users.find((user) => user.id === userPatch.id);
        return {...user, ...userPatch};
      },
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
