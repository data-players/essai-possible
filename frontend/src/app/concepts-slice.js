import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector, stateSelector, baseCreateMutation, baseUpdateMutation} from "./apiMiddleware.js";
import {normalize, sorter} from "./utils.js";
import * as yup from "yup";
import {
  required,
  requiredArray,
  requiredEmail,
  requiredPositiveNumber,
  requiredPhone,
  requiredString,
} from "./fieldValidation.js";
import {createJsonLDMarshaller} from "./utils.js";

/**
 * Skills SLICE
 */
const skillsAdapter = createEntityAdapter();
const skillsInitialState = skillsAdapter.getInitialState({
  status: {},
});
const skillsSlice = createSlice({
  name: "skills",
  initialState: skillsInitialState,
  extraReducers(builder) {
    builder.addMatcher(matchAny("matchFulfilled", ["fetchSkills"]), skillsAdapter.upsertMany);
    addStatusForEndpoints(builder, ["fetchSkills"]);
  },
});
export const skillReducer = skillsSlice.reducer;


/**
 * Status SLICE
 */
const statusAdapter = createEntityAdapter();
const statusInitialState = statusAdapter.getInitialState({
  status: {},
});
const statusSlice = createSlice({
  name: "status",
  initialState: statusInitialState,
  extraReducers(builder) {
    builder.addMatcher(matchAny("matchFulfilled", ["fetchStatus"]), statusAdapter.upsertMany);
    addStatusForEndpoints(builder, ["fetchStatus"]);
  },
});
export const statusReducer = statusSlice.reducer;

/**
 * Goals SLICE
 */
const goalsAdapter = createEntityAdapter();
const goalsInitialState = goalsAdapter.getInitialState({
  status: {},
});
const goalsSlice = createSlice({
  name: "goals",
  initialState: goalsInitialState,
  extraReducers(builder) {
    builder.addMatcher(matchAny("matchFulfilled", ["fetchGoals"]), goalsAdapter.upsertMany);
    addStatusForEndpoints(builder, ["fetchGoals"]);
  },
});
export const goalsReducer = goalsSlice.reducer;

/**
 * Sectors SLICE
 */
const sectorsAdapter = createEntityAdapter();
const sectorsInitialState = sectorsAdapter.getInitialState({
  status: {},
});
const sectorsSlice = createSlice({
  name: "sectors",
  initialState: sectorsInitialState,
  extraReducers(builder) {
    builder.addMatcher(matchAny("matchFulfilled", ["fetchSectors"]), sectorsAdapter.upsertMany);
    addStatusForEndpoints(builder, ["fetchSectors"]);
  },
});
export const sectorReducer = sectorsSlice.reducer;


/**
 * Skills SELECTORS
 */

export const selectSkillsReady = readySelector("skills", "fetchSkills");
export const selectSkillsStatus = stateSelector("skills", "fetchSkills");

export const {selectAll: selectAllSkills} = skillsAdapter.getSelectors((state) => state.skills);

/**
 * Status SELECTORS
 */

export const selectStatusReady = readySelector("status", "fetchStatus");
export const selectStatusStatus = stateSelector("status", "fetchStatus");

export const {selectAll: selectAllStatus} = statusAdapter.getSelectors((state) => state.status);

/**
 * Goals SELECTORS
 */
export const selectGoalsReady = readySelector("goals", "fetchGoals");
export const selectGoalsStatus = stateSelector("goals", "fetchGoals");

export const {selectAll: selectAllGoals} = goalsAdapter.getSelectors((state) => {
  // console.log('state',state)
  return state.goals
});


/**
 * Sectors SELECTORS
 */

export const selectSectorsReady = readySelector("sectors", "fetchSectors");
export const selectSectorsStatus = stateSelector("sectors", "fetchSectors");

export const {selectAll: selectAllSectors} = sectorsAdapter.getSelectors((state) => state.sectors);

/**
 * Skills Mashaller
 */
const skillMarshaller = createJsonLDMarshaller({
  label: "pair:label"
});

/**
 * Status Mashaller
 */
const statusMarshaller = createJsonLDMarshaller({
  label: "pair:label",
  icon : "ep:icon",
  color : "ep:color"
});

/**
 * Goals Mashaller
 */
const goalMarshaller = createJsonLDMarshaller({
  label: "pair:label"
});

/**
 * Sectors Mashaller
 */
const sectorMarshaller = createJsonLDMarshaller({
  label: "pair:label",
});



/**
 * Skills API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    fetchSkills: builder.query({
      query() {
        return `/skills`;
      },
      transformResponse(baseResponse, meta) {
        return baseResponse["ldp:contains"].map(skillMarshaller.marshall);
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});

/**
 * Status API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    fetchStatus: builder.query({
      query() {
        return `/status`;
      },
      transformResponse(baseResponse, meta) {
        return baseResponse["ldp:contains"].map(statusMarshaller.marshall);
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});

/**
 * Goals API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    fetchGoals: builder.query({
      query() {
        return `/challenges`;
      },
      transformResponse(baseResponse, meta) {
        return baseResponse["ldp:contains"].map(goalMarshaller.marshall);
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});


/**
 * SECTORS API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the list of all companies
    fetchSectors: builder.query({
      query() {
        return `/sectors`;
      },
      transformResponse(baseResponse, meta) {
        return baseResponse["ldp:contains"].map(sectorMarshaller.marshall);
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});

/**
 * export api hooks
 */


export const {
  useFetchSkillsQuery,
  useFetchStatusQuery,
  useFetchGoalsQuery,
  useFetchSectorsQuery
} = api;
