import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../../app/api.js";
import {meetings} from "./meetings-slice-data.js";

/**
 * MEETINGS SLICE
 */
const meetingsAdapter = createEntityAdapter({
  // selectId: (meeting) => `${meeting.company.name}/${meeting.id}`,
  // sortComparer: (a, b) => {
  //     console.log(a.createdAt, b.createdAt, b.createdAt?.localeCompare(a.createdAt));
  //     return b.createdAt?.localeCompare(a.createdAt)
  // },
});

const initialState = meetingsAdapter.getInitialState({
  status: {},
  savedFormData: {}, // Saves ongoing progresses from the user in the way {offerId1: {...savedData1}, offerId2: {...savedData2}}
});

const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    saveFormData: (state, {payload: {offerId, data: newFormData}}) => {
      state.savedFormData[offerId] = {...state.savedFormData[offerId], ...newFormData};
    },
    cleanFormData: (state, {payload: offerId}) => {
      delete state.savedFormData[offerId];
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(matchAny("matchFulfilled", ["fetchMeetings"]), meetingsAdapter.upsertMany)
      .addMatcher(matchAny("matchFulfilled", ["fetchMeeting"]), meetingsAdapter.upsertOne);

    addStatusForEndpoints(builder, ["fetchMeetings"]);
  },
});

export default meetingsSlice.reducer;
export const meetingsActions = meetingsSlice.actions;

/**
 * MEETINGS SELECTORS
 */

export const selectMeetingsReady = readySelector("meetings", "fetchMeetings");
export const selectSavedFormData = (state, offerId) => state.meetings.savedFormData[offerId];
export const {
  selectAll: selectAllMeetings,
  selectById: selectMeetingById,
  selectIds: selectMeetingIds,
} = meetingsAdapter.getSelectors((state) => state.meetings);

/**
 * MEETINGS API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the list of all meetings
    fetchMeetings: builder.query({
      query(companyId) {
        return `/breeds?limit=1`;
      },
      transformResponse() {
        // Mock data with meetings
        return meetings;
      },
    }),

    // Fetch one meeting by id
    fetchMeeting: builder.query({
      query(id) {
        return `/breeds?limit=10`;
      },
      transformResponse(baseQueryReturnValue, meta, id) {
        // Mock data with meetings
        return meetings.find((meeting) => meeting.id === id);
      },
    }),
  }),
});

export const {useFetchMeetingsQuery, useFetchMeetingQuery} = api;
