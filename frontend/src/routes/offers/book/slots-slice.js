import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector, baseCreateMutation, baseDeleteMutation} from "../../../app/apiMiddleware.js";
import {sorter,createJsonLDMarshaller} from "../../../app/utils.js";
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
  // console.log('selectSlotsForOffer',slots,offerId)
  return slots.filter((slot) => slot.offer === offerId);
};

/**
 * slot Mashaller
 */

const marshaller = createJsonLDMarshaller(
  {
    start : "pair:label",
    type: "type",
    start: "pair:startDate",
    offer: "pair:about",
  },
  {
    encodeUriFields: ["offer"],
    defaultValues:[
      {
        key : "type",
        value : "ep:TimeSlot" 
      }
    ]
  }
);

/**
 * SLOTS API ENDPOINTS
 */

// Mock data
let counter = slots.length + 1;
const getCounter = () => counter++;

api.injectEndpoints({
  endpoints: (builder) => ({
    fetchSlots: builder.query({
      query: () => `/timeSlot`,
      transformResponse(baseResponse, meta) {
        return baseResponse["ldp:contains"].map((company) => marshaller.marshall(company));
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    addSlot: builder.mutation({
      queryFn: baseCreateMutation(marshaller, "timeSlot"),
    }),

    deleteSlot: builder.mutation({
      queryFn: baseDeleteMutation()
    }),
  }),
});

export const {
  useFetchSlotsQuery,
  useAddSlotMutation,
  useUpdateSlotMutation,
  useDeleteSlotMutation,
} = api;
