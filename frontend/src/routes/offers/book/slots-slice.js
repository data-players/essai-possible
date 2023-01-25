import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../../app/api.js";
import {sorter} from "../../../app/utils.js";
import {slots} from "./slots-slice-data.js";

/**
 * SLOTS SLICE
 */
const slotsAdapter = createEntityAdapter({
  sortComparer: (a, b) => sorter.date(a.start, b.start),
});

const initialState = slotsAdapter.getInitialState({
  status: {},
});

const slotsSlice = createSlice({
  name: "slots",
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(matchAny("matchFulfilled", ["fetchSlots"]), slotsAdapter.upsertMany)
      .addMatcher(matchAny("matchFulfilled", ["addSlot"]), slotsAdapter.addOne)
      .addMatcher(matchAny("matchFulfilled", ["deleteSlot"]), slotsAdapter.removeOne);

    addStatusForEndpoints(builder, ["fetchSlots"]);
  },
});

export default slotsSlice.reducer;
export const slotsActions = slotsSlice.actions;

/**
 * SLOTS SELECTORS
 */

export const selectSlotsReady = readySelector("slots", "fetchSlots");
export const {
  selectAll: selectAllSlots,
  selectById: selectSlotById,
  selectIds: selectSlotsIds,
} = slotsAdapter.getSelectors((state) => state.slots);

export const selectSlotsForOffer = (state, offerId) => {
  const slots = selectAllSlots(state);
  return slots.filter((slot) => slot.offer === offerId);
};

/**
 * SLOTS API ENDPOINTS
 */

// Mock data
let counter = slots.length + 1;
const getCounter = () => counter++;

api.injectEndpoints({
  endpoints: (builder) => ({
    fetchSlots: builder.query({
      query: ({offer} = {}) => "breeds?limit=100",
      // query: ({offer}) => "slots",
      transformResponse(baseQueryReturnValue, meta, {offer} = {}) {
        // Mock data
        console.log("fetchMetings");
        return offer ? slots.filter((slot) => slot.offer == offer) : slots;
      },
    }),

    addSlot: builder.mutation({
      query: (val) => {
        return "breeds?limit=100";
      },
      // query: ({slot, comments}) => ({
      //   url: "slots",
      //   method: "POST",
      //   body: {slot, comments},
      // }),
      transformResponse(baseResponse, meta, {slot, comments}) {
        // Mock data
        const res = {id: getCounter(), slot, comments};
        return res;
      },
    }),

    deleteSlot: builder.mutation({
      query: (id) => "breeds?limit=100",
      // query: (id) => ({
      //   url: `slot`,
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
  useFetchSlotsQuery,
  useAddSlotMutation,
  useUpdateSlotMutation,
  useDeleteSlotMutation,
} = api;
