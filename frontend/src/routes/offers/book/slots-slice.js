import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector, baseCreateMutation, baseDeleteMutation, baseUpdateCore} from "../../../app/apiMiddleware.js";
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
  // const slots = selectAllSlots(state);
  const slots=[];
  return slots;
  // console.log('selectSlotsForOffer',slots,offerId)
  // return slots.filter((slot) => slot.offer === offerId);
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
    user : "pair:concerns"
  },
  {
    encodeUriFields: ["offer","user"],
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
let counter = slots?.length + 1;
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

    // fetchSlot: builder.query({
    //   query: (id) => {
    //     return decodeURIComponent(id);
    //   },
    //   transformResponse(baseResponse, meta, arg) {
    //     // console.log('transformResponse',baseResponse)
    //     return marshaller.marshall(baseResponse);
    //   },
    //   keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.

    // }),

    fetchSlot: builder.query({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        console.log('fetchSlot',args);
        const baseResponse = await baseQuery({
          url: decodeURIComponent(args),
        });
        const data = marshaller.marshall(baseResponse.data);
        const userResult = data.user && !Array.isArray(data.user) ? await dispatch(api.endpoints.fetchUser.initiate(data.user)): undefined;
        const finalData ={
          ...data,
          user:userResult?.data
        }
      
        // console.log('finalData',finalData)
        return {
          data:finalData
        }
      },     
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),


    addSlot: builder.mutation({
      queryFn: baseCreateMutation(marshaller, "timeSlot", "https://data.essai-possible.data-players.com/context.json"),
    }),

    updateSlot: builder.mutation({
      queryFn: async (args, {getState, dispatch}, extraOptions, baseQuery) => {
        const marshallData = await  baseUpdateCore(args,marshaller,baseQuery,async (id)=>{
          const fetchData= await dispatch(api.endpoints.fetchSlot.initiate(id),{forceRefetch: true});
          return fetchData.data;
        })
        // const body = marshaller.unmarshall(args);
        // await baseQuery({
        //   url: body.id,
        //   method: "PUT",
        //   body: body,
        // });
        // const data = (await baseQuery(body.id)).data;
        // const marshallData = marshaller.marshall(data);
        // console.log('REFETCH',marshallData)
        setTimeout(() => {
          dispatch(api.endpoints.fetchCurrentUser.initiate(undefined,{forceRefetch: true}));
          dispatch(api.endpoints.fetchOffer.initiate(marshallData.data.offer,{forceRefetch: true}));
        }, 500);




        return {data: marshallData.data};
      }
    }),

    deleteSlot: builder.mutation({
      queryFn: baseDeleteMutation()
    }),
  }),
});

export const {
  // useFetchSlotsQuery,
  useAddSlotMutation,
  useUpdateSlotMutation,
  useDeleteSlotMutation,
} = api;
