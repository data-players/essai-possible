import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector,  baseCreateMutation, baseUpdateMutation} from "../../app/apiMiddleware.js";
import {normalize, sorter} from "../../app/utils.js";
import {fullOffers, lightOffersList, statusOptions} from "./offers-slice-data.js";
import {selectAllCompaniesById} from "./companies-slice.js";
import {selectAllStatus} from "../../app/concepts-slice.js";
import * as yup from "yup";
import {
  required,
  requiredArray,
  requiredEmail,
  requiredPositiveNumber,
  requiredPhone,
  requiredString,
} from "../../app/fieldValidation.js";
import {createJsonLDMarshaller} from "./../../app/utils.js";

/**
 * OFFERS SLICE
 */
const offersAdapter = createEntityAdapter({
  sortComparer: (a, b) => sorter.date(a.publishedAt, b.publishedAt),
});

const initialState = offersAdapter.getInitialState({
  status: {},
});

const offersSlice = createSlice({
  name: "offers",
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(matchAny("matchFulfilled", ["fetchOffers"]), offersAdapter.upsertMany)
      .addMatcher(matchAny("matchFulfilled", ["fetchOffer"]), offersAdapter.upsertOne)
      .addMatcher(matchAny("matchFulfilled", ["updateOffer"]), offersAdapter.upsertOne)
      .addMatcher(matchAny("matchFulfilled", ["addOffer"]), offersAdapter.addOne)
      .addMatcher(matchAny("matchFulfilled", ["deleteOffer"]), offersAdapter.removeOne);
    addStatusForEndpoints(builder, ["fetchOffers", "fetchOffer"]);
  },
});
export default offersSlice.reducer;

/**
 * OFFERS SELECTORS
 */

export const selectOffersReady = readySelector("offers", "fetchOffers");
export const selectOfferReady = readySelector("offers", "fetchOffer");

export const {
  selectAll: selectAllOffers,
  selectById: selectOfferById,
  selectIds: selectOfferIds,
} = offersAdapter.getSelectors((state) => state.offers);

export const selectOfferIdsForCompany = (state, companyId) =>
{
  const offers=  selectAllOffers(state)
    .filter((offer) => offer.company === companyId)
    .map((offer) => offer.id);
  return offers
}


/**
 * Offers Mashaller
 */

const marshaller = createJsonLDMarshaller(
  {
    title : "pair:label",
    description: "pair:description",
    company : "pair:offeredBy",
    softSkills: "pair:hasSkill",
    status: "pair:hasStatus",
    type: "type",
    location: "pair:hasLocation",
    workEnvironment: "ep:workEnvironment",
    timeSchedule :"ep:timeSchedule",
    duration: "ep:duration",
    meetingDuration: "ep:meetingDuration",
    meetingDetails: "ep:meetingDetails",
    mentorEmail: "pair:e-mail",
    mentorPhone: "pair:phone",
    tasks: "ep:tasks",
    skills: "ep:skills",
    goal: "pair:hasChallenge",
    particularConditions:"ep:particularConditions",
    possibleArrangements:"ep:possibleArrangements",
    slots:"ep:subjectOf"

  },
  {
    objectArrayFields: ["softSkills","slots"],
    encodeUriFields: ["softSkills","company","status","slots","goal"],
    defaultValues:[
      {
        key : "type",
        value : "ep:Job" 
      }
    ]
  }
);


// Apply the filter selection to the offers list
// More on selector memoization : https://react-redux.js.org/api/hooks#using-memoizing-selectors / https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions
export const selectFilteredOffersIds = createSelector(
  [
    (state) => selectAllOffers(state),
    selectAllCompaniesById,
    (state, {search}) => search,
    (state, {location}) => location,
    (state, {radius}) => radius,
    (state, {sectors}) => sectors,
    (state, {goals}) => goals,
    selectAllStatus
  ],
  (allOffers, companiesById, search, location, radius, sectors, goals,status) => {
    const publishedStatus = status.find(s=>s.id.includes('publiee'))?.id;
    const offers = allOffers.filter(o=>o.status==publishedStatus);
    const hasSearch = search !== "";
    const hasLocationData = location?.lat && location?.long;
    const hasSectors = sectors?.length > 0;
    const hasGoals = goals?.length > 0;
    const hasAnyFilter = hasSearch || hasLocationData || hasSectors || hasGoals;

    // Sur Google Maps, 1km de large c'est 0.01344481 de longitude et 0.00924511 de latitude, grosso modo pour la france
    const oneKmOf = {Latitude: 0.00924511, Longitude: 0.01344481};
    const locationBoundaries = hasLocationData && {
      north: location.lat + oneKmOf.Latitude * radius,
      south: location.lat - oneKmOf.Latitude * radius,
      east: location.long + oneKmOf.Longitude * radius,
      west: location.long - oneKmOf.Longitude * radius,
    };

    const isInLocationBoundaries = ({lat, long}) => {
      return (
        lat < locationBoundaries.north &&
        lat > locationBoundaries.south &&
        long < locationBoundaries.east &&
        long > locationBoundaries.west
      );
    };

    const searchInFields = (fields, search) =>
      fields.find((field) => normalize(field).includes(normalize(search)));

    const matchInArray = (elementArray, filterArray) => {
      return filterArray.find((option) => elementArray.includes(option));
    };
    console.log('hasAnyFilter',hasAnyFilter,offers)
    const filteredOffers = hasAnyFilter
      ? offers.filter((offer) => {
          const company = companiesById[offer.company] || {};

          return (
            (!hasSearch ||
              searchInFields([offer.title, company.name, offer.description], search)) &&
            (!hasLocationData || isInLocationBoundaries(offer.location)) &&
            (!hasSectors || matchInArray(company.sectors, sectors)) &&
            (!hasGoals || matchInArray([offer.goal], goals))
          );
        })
      : offers;

    return filteredOffers.map((offer) => offer.id);
  }
);

async function disassemblySlots(state, args, dispatch) {
  const existing = { ...state.offers.entities[args.id] };
  const slotsToCreate = args.slots.filter(s => s.id == undefined);
  const slotsWithId = args.slots.filter(s => s.id != undefined);
  const slotsToDelete = existing?.slots?existing.slots.filter(s => !slotsWithId.map(swid => swid.id).includes(s.id)):[];
  console.log('slotsToCreate',slotsToCreate);
  console.log('slotsToDelete',slotsToDelete);

  const createdSlotsId = [];
  for (const slotToCreate of slotsToCreate) {
    const createdSlot = await dispatch(api.endpoints.addSlot.initiate({
      start: slotToCreate.start,
      offer: args.id
    }));
    createdSlotsId.push(createdSlot.data.id);
  }
  for (const slotToDelete of slotsToDelete) {
    if (slotToDelete != undefined && slotToDelete != 'undefined') {
      // console.log("slotToDelete",slotToDelete)
      const deletedSlot = await dispatch(api.endpoints.deleteSlot.initiate(slotToDelete.id));
    }
  }

  const allSlotsIds = slotsWithId.map(s => s.id).concat(createdSlotsId);
  let dataToUpdate = { ...args };
  dataToUpdate.slots = allSlotsIds;
  return dataToUpdate;
}
/**
 * OFFERS API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the list of all offers
    fetchOffers: builder.query({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        const baseResponse = await baseQuery({
          url: `/jobs`,
        });
        const data = baseResponse.data["ldp:contains"].map((company) => marshaller.marshall(company));
        // console.log('fetchOffers',data)
        return {
          data
        }
      },
      // query: () => `/jobs`,
      // transformResponse(baseResponse, meta) {
      //   return baseResponse["ldp:contains"].map((company) => marshaller.marshall(company));
      // },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
    findOffers: builder.query({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        const baseResponse = await baseQuery({
          url: `/jobs`,
        });
        const data = baseResponse.data["ldp:contains"].map((company) => marshaller.marshall(company));
        // console.log('fetchOffers',data)
        return {
          data
        }
      },
      // query: () => `/jobs`,
      // transformResponse(baseResponse, meta) {
      //   return baseResponse["ldp:contains"].map((company) => marshaller.marshall(company));
      // },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one offer by id
    fetchOffer: builder.query({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        console.log('fetchOffer',args);
        const baseResponse = await baseQuery({
          url: decodeURIComponent(args),
        });
        const data = marshaller.marshall(baseResponse.data);
        const slots= [];
        for (const slot of data.slots) {
          // console.log('get slot',slot)
          const slotResult = await dispatch(api.endpoints.fetchUser.initiate(slot));
          slots.push(slotResult.data)
          // console.log(slotData.data);
        }
        const finalData = {
          ...data,
          slots, 
        }
        // console.log('finalData',finalData)
        return {
          data:finalData
        }
      },     
      // query: (id) => {
      //   return decodeURIComponent(id);
      // },
      // transformResponse(baseResponse, meta, arg) {
      //   // Mock data with companies
      //   return marshaller.marshall(baseResponse);
      // },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),


    addOffer: builder.mutation({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {

        const state= getState();
        let dataToUpdate = await disassemblySlots(state, args, dispatch);
        // console.log("updateOffer",dataToUpdate)

        const body = marshaller.unmarshall(dataToUpdate);
        body.id=undefined;
        body['@context']="https://data.essai-possible.data-players.com/context.json"
        // console.log("updateOffer body",body)

        const postResponse = await baseQuery({
          url: "/jobs",
          method: "POST",
          body: body,
        });

        const status = postResponse.meta.response.status;
        if (status==201){
          const newId = postResponse.meta.response.headers.get('location');
          const fetchResponse= await dispatch(api.endpoints.fetchOffer.initiate(newId));
          const marshallData=fetchResponse.data;
  
          // console.log("updated Offer",marshallData)
          return {data: marshallData};
        } else {
          return {error:`status ${status}`}
        }

      }
    }),

    updateOffer: builder.mutation({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {

        const state= getState();
        let dataToUpdate = await disassemblySlots(state, args, dispatch);
        // console.log("updateOffer",dataToUpdate)

        const body = marshaller.unmarshall(dataToUpdate);
        // console.log("updateOffer body",body)

        await baseQuery({
          url: body.id,
          method: "PUT",
          body: body,
        });
        const fetchResponse= await dispatch(api.endpoints.fetchOffer.initiate(args.id));
        const marshallData=fetchResponse.data;

        // console.log("updated Offer",marshallData)
        return {data: marshallData};
      }
    }),

    deleteOffer: builder.mutation({
      query: (id) => "/jobs",
      // query: (id) => ({
      //   url: `offer`,
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
  useFetchOffersQuery,
  useFindOffersQuery,
  useFetchOfferQuery,
  useAddOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = api;

/**
 * OFFERS FORM UTILITIES
 */

export const offerValidationSchema = yup.object({
  // Job description
  title: requiredString,
  goal: requiredString,
  description: requiredString,
  tasks: requiredString,
  skills: requiredString,
  softSkills: requiredArray,
  workEnvironment: requiredString,

  // Offer modalities
  duration: requiredPositiveNumber,
  timeSchedule: requiredString,
  location: required,

  // Meeting modalities
  meetingDuration: requiredPositiveNumber,
  meetingDetails: requiredString,
  mentorPhone: requiredPhone,
  mentorEmail: requiredEmail,

  // Status
  status: requiredString,
});

export const offerDefaultValues = {
  // Job description
  title: "",
  goal: "",
  description: "",
  tasks: "",
  skills: "",
  softSkills: [],
  workEnvironment: "",

  // Offer modalities
  duration: undefined,
  timeSchedule: "",
  location: null,
  particularConditions: "",
  possibleArrangements: "",

  // Meeting modalities
  meetingDuration: 30,
  meetingDetails: "",
  mentorPhone: "",
  mentorEmail: "",

  // Status
  // status: "Brouillon", // TODO : set default in component
  publishedAt: undefined,

  //Slots
  // slots : []

};



