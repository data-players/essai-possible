import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../../app/api.js";
import {meetings} from "./meetings-slice-data.js";

/**
 * MEETINGS SLICE
 */
const meetingsAdapter = createEntityAdapter({
  // selectId: (meeting) => meeting.slot,
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
      .addMatcher(matchAny("matchFulfilled", ["updateMeeting"]), meetingsAdapter.upsertOne)
      .addMatcher(matchAny("matchFulfilled", ["addMeeting"]), meetingsAdapter.addOne)
      .addMatcher(matchAny("matchFulfilled", ["deleteMeeting"]), meetingsAdapter.removeOne);

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
  selectById: selectMeetingBySlotId,
  selectIds: selectMeetingSlotIds,
} = meetingsAdapter.getSelectors((state) => state.meetings);

export const selectMeetingForOffer = (state, offer) => {
  const meetings = selectAllMeetings(state);
  const slotIds = offer.slots?.map((slot) => slot.id);
  return slotIds && meetings.find((meeting) => slotIds.includes(meeting.slot));
};

/**
 * MEETINGS API ENDPOINTS
 */

// Mock data
let counter = meetings.length + 1;
const getCounter = () => counter++;

api.injectEndpoints({
  endpoints: (builder) => ({
    fetchMeetings: builder.query({
      query: () => "breeds?limit=100",
      // query: () => "meetings",
      transformResponse() {
        // Mock data
        return meetings;
      },
    }),

    addMeeting: builder.mutation({
      query: (val) => {
        return "breeds?limit=100";
      },
      // query: ({slot, comments}) => ({
      //   url: "meetings",
      //   method: "POST",
      //   body: {slot, comments},
      // }),
      transformResponse(baseResponse, meta, {slot, comments}) {
        // Mock data
        const res = {id: getCounter(), slot, comments};
        return res;
      },
    }),

    updateMeeting: builder.mutation({
      query: () => "breeds?limit=100",
      // query: (meetingPatch) => ({
      //   url: "meetings",
      //   method: "PATCH",
      //   body: meetingPatch,
      // }),
      transformResponse(baseQueryReturnValue, meta, meetingPatch) {
        // Mock data
        let meeting = meetings.find((meeting) => meeting.id === meetingPatch.id);

        console.log("UPDATE", {...meeting, ...meetingPatch});
        return {...meeting, ...meetingPatch};
      },
    }),

    deleteMeeting: builder.mutation({
      query: (id) => "breeds?limit=100",
      // query: (id) => ({
      //   url: `meeting`,
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
  useLazyFetchMeetingsQuery,
  useAddMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} = api;
