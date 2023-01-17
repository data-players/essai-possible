import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {selectCurrentUser} from "../../../app/auth-slice.js";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../../app/api.js";
import {normalize} from "../../../app/utils.js";
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
  status: "idle",
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

export const selectMeetingsReady = readySelector("meetings");
export const selectSavedFormData = (state, offerId) => state.meetings.savedFormData[offerId];
export const {
  selectAll: selectAllMeetings,
  selectById: selectMeetingById,
  selectIds: selectMeetingIds,
} = meetingsAdapter.getSelectors((state) => state.meetings);

// Apply the user filter selection to the meetings list
// More on selector memoization : https://react-redux.js.org/api/hooks#using-memoizing-selectors / https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions
export const selectFilteredMeetingsIds = createSelector(
  [
    selectAllMeetings,
    (state, searchText, locationText, radius) => searchText,
    (state, searchText, locationText, radius) => locationText,
    (state, searchText, locationText, radius) => radius,
  ],
  (meetings, searchText, locationText, radius) => {
    const hasSearchText = searchText !== "";
    const hasLocalizationText = locationText !== "";

    const searchInFields = (fields, searchText) =>
      fields.find((field) => normalize(field).includes(normalize(searchText)));

    const filteredMeetings =
      hasSearchText || hasLocalizationText
        ? meetings.filter((item) => {
            const {
              title,
              company: {name: companyName},
              description,
              location,
            } = item;

            return (
              (!hasSearchText || searchInFields([title, companyName, description], searchText)) &&
              (!hasLocalizationText || searchInFields([location], locationText))
            );
          })
        : meetings;

    return filteredMeetings.map((meeting) => meeting.id);
  }
);

export const selectMeetingsForUser = createSelector(
  [selectAllMeetings, (state) => selectCurrentUser(state)?.id],
  (meetings, currentUserId) => meetings.filter((meeting) => meeting.user === currentUserId)
);

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
