import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../../app/apiMiddleware.js";
import {meetings} from "./meetings-slice-data.js";
import {selectSlotsForOffer} from "./slots-slice.js";

/**
 * MEETINGS SLICE
 */
const meetingsAdapter = createEntityAdapter();

const initialState = meetingsAdapter.getInitialState({
  status: {},
  savedFormData: {}, // Saves ongoing progresses from the user in the way {offerId1: {...savedData1}, offerId2: {...savedData2}}
});

const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    saveFormData: (state, {payload: {offerId, data: newFormData}}) => {
      console.log('slice saveFormData',offerId)
      // const newSavedFormatOffer =  {...state.savedFormData[offerId], ...newFormData};
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
      .addMatcher(matchAny("matchFulfilled", ["deleteMeeting"]), meetingsAdapter.removeOne)

      // Remove all meetings on delete user
      .addMatcher(matchAny("matchFulfilled", ["deleteUser"]), meetingsAdapter.removeAll);

    addStatusForEndpoints(builder, ["fetchMeetings"]);
  },
});

export default meetingsSlice.reducer;
export const meetingsActions = meetingsSlice.actions;

/**
 * MEETINGS SELECTORS
 */

// export const selectMeetingsReady = readySelector("meetings", "fetchMeetings");
export const selectSavedFormData = (state, offerId) => state.meetings.savedFormData[offerId];
// export const {
//   selectAll: selectAllMeetings,
//   selectById: selectMeetingBySlotId,
//   selectIds: selectMeetingSlotIds,
// } = meetingsAdapter.getSelectors((state) => state.meetings);

// export const selectMeetingForOffer = (state, offerId) => {
//   // const slotsForOffer = selectSlotsForOffer(state, offerId);
//   const slotsForOffer = [];
//   const meetings = selectAllMeetings(state);
//   return meetings.find((meeting) => slotsForOffer.find((slot) => slot.id === meeting.slot));
// };

/**
 * MEETINGS API ENDPOINTS
 */

// Mock data
let counter = meetings?.length + 1;
const getCounter = () => counter++;

api.injectEndpoints({
  endpoints: (builder) => ({
    fetchMeetings: builder.query({
      query: () => "/timeSlot",
      // query: () => "meetings",
      transformResponse() {
        // Mock data
        return meetings;
      },
    }),

    addMeeting: builder.mutation({
      query: (val) => {
        return "/timeSlot";
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
      query: () => "/timeSlot",
      // query: (meetingPatch) => ({
      //   url: "meetings",
      //   method: "PATCH",
      //   body: meetingPatch,
      // }),
      transformResponse(baseQueryReturnValue, meta, meetingPatch) {
        // Mock data
        let meeting = meetings.find((meeting) => meeting.id === meetingPatch.id);
        return {...meeting, ...meetingPatch};
      },
    }),

    deleteMeeting: builder.mutation({
      query: (id) => "/timeSlot",
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
  // useLazyFetchMeetingsQuery,
  // useAddMeetingMutation,
  // useUpdateMeetingMutation,
  // useDeleteMeetingMutation,
} = api;
