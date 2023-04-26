import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector,  baseUpdateCore, baseCreateCore, baseCreateMutation, baseUpdateMutation} from "../../app/apiMiddleware.js";
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
    ],
    transformRules :[
      {
        key : "location",
        marshall : (data)=>{
          return {
            'city':data['pair:hasPostalAddress']?.['pair:addressLocality'],
            'context':data['pair:label'],
            'label':data['pair:label'],
            'lat':data['pair:latitude'],
            'long':data['pair:longitude']
          }
        },
        unmarshall  : (data)=>{
          return {
            'pair:hasPostalAddress':{
              'pair:addressCountry':'France',
              'pair:addressLocality':data.city,
              'type':'pair:PostalAddress'
            },
            'pair:label':data.label,
            'pair:latitude':data.lat,
            'pair:longitude':data.long,
            'type':'pair:place'
          }
        }
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
    const hasLocation = location?.lat && location?.long;
    const hasSectors = sectors?.length > 0;
    const hasGoals = goals?.length > 0;
    const hasAnyFilter = hasSearch || hasLocation || hasSectors || hasGoals;

    // Sur Google Maps, 1km de large c'est 0.01344481 de longitude et 0.00924511 de latitude, grosso modo pour la france
    const oneKmOf = {Latitude: 0.00924511, Longitude: 0.01344481};
    const locationBoundaries = hasLocation && {
      north: location.lat + oneKmOf.Latitude * radius,
      south: location.lat - oneKmOf.Latitude * radius,
      east: location.long + oneKmOf.Longitude * radius,
      west: location.long - oneKmOf.Longitude * radius,
    };

    const isInLocationBoundaries = (locationData) => {
      const lat = locationData?.lat;
      const long = locationData?.long;
      if(lat& long){
        return (
          lat < locationBoundaries.north &&
          lat > locationBoundaries.south &&
          long < locationBoundaries.east &&
          long > locationBoundaries.west
        );
      }else{
        return false;
      }

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
            (!hasLocation || isInLocationBoundaries(offer.location)) &&
            (!hasSectors || matchInArray(company.sectors, sectors)) &&
            (!hasGoals || matchInArray([offer.goal], goals))
          );
        })
      : offers;

    return filteredOffers.map((offer) => offer.id);
  }
);

async function fetchSlotForOffer(data, dispatch, forceRefetch) {
  // console.log('fetchslotforOffer',data)
  if(data.slots && Array.isArray(data.slots)){
    let fetchSlotPromises = [];
    for (const slot of data.slots) {
      fetchSlotPromises.push(new Promise(async (resolve, reject) => {
        try {
          const slotResult = await dispatch(api.endpoints.fetchSlot.initiate(slot,{forceRefetch: forceRefetch}));
          resolve(slotResult.data);
        } catch (error) {
          reject(error);
        }
      }));
  
    }
    const slots = await Promise.all(fetchSlotPromises);
    const nextSlots = slots.filter(s => new Date(s.start) > new Date());
    // const nextSlots = slots;
    // console.log(slots, nextSlots);
    const finalData = {
      ...data,
      slots,
      nextSlots
    };
    return finalData;
  }else{
    return data;
  }

}

async function disassemblySlots(state, args, dispatch) {
  // console.log('args',args)
  if(args.slots){
    const existing = { ...state.offers.entities[args.id] };
    // console.log(existing);
    const slotsToCreate = args.slots.filter(s => s.id == undefined);
    const slotsWithId = args.slots.filter(s => s.id != undefined);
    const slotsToDelete = existing?.slots?existing.slots.filter(s => !slotsWithId.map(swid => swid.id).includes(s.id)):[];
    // console.log('slotsToCreate',slotsToCreate);
    // console.log('slotsToDelete',slotsToDelete);
  
    const createdSlotsId = [];
    let disassemblyPromises = [];

    for (const slotToCreate of slotsToCreate) {
      disassemblyPromises.push(new Promise(async (resolve,reject)=>{
        try {
          const createdSlot = await dispatch(api.endpoints.addSlot.initiate({
            start: slotToCreate.start,
            offer: args.id
          }));
          createdSlotsId.push(createdSlot.data.id);
          resolve();
        } catch (error) {
          reject(error)
        }
      }))

    }
    for (const slotToDelete of slotsToDelete) {
      disassemblyPromises.push(new Promise(async (resolve,reject)=>{
        try {
          if (slotToDelete != undefined && slotToDelete != 'undefined') {
            // console.log("slotToDelete",slotToDelete)
            const deletedSlot = await dispatch(api.endpoints.deleteSlot.initiate(slotToDelete.id));
          }
          resolve();
        } catch (error) {
          reject(error)
        }
      }))
    }
    const promiseResult = await Promise.all(disassemblyPromises)
  
    const allSlotsIds = slotsWithId.map(s => s.id).concat(createdSlotsId);
    let dataToUpdate = { ...args };
    dataToUpdate.slots = allSlotsIds;
    // console.log('data after disassembly',dataToUpdate)
    return dataToUpdate;
  }else{
    return { ...args };
  }

}
/**
 * OFFERS API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the list of all offers
    fetchOffers: builder.query({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        // console.log("XX fetchOffers")
        const baseResponse = await baseQuery({
          url: `/jobs`,
        });
        const list = baseResponse.data["ldp:contains"].map((offer) => marshaller.marshall(offer));
        const listWithSlots = await Promise.all(list.map(item=>fetchSlotForOffer(item, dispatch)))

        return {
          data : listWithSlots
        }
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
    findOffers: builder.query({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {

        const baseResponse = await baseQuery({
          url: `/jobs`,
        });
        const data = baseResponse.data["ldp:contains"].map((offer) => marshaller.marshall(offer));
        // console.log('fetchOffers',data)
        return {
          data
        }
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one offer by id
    fetchOffer: builder.query({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        // console.log('fetchOffer',args);
        const baseResponse = await baseQuery({
          url: decodeURIComponent(args),
        });
        const data = marshaller.marshall(baseResponse.data);
        // const slots= [];
        const finalData = await fetchSlotForOffer(data, dispatch,true);
        // console.log('finalData fetchOffer',finalData)
        return {
          data:finalData
        }
      },     
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),


    addOffer: builder.mutation({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {

        const state= getState();
        let dataToUpdate = await disassemblySlots(state, args, dispatch);

        console.log('--------------------- DISASEMBY SLOT END')

        const out = await baseCreateCore(dataToUpdate,marshaller,baseQuery,"/jobs","https://data.essai-possible.data-players.com/context.json",async (id)=>{
          const fetchData= await dispatch(api.endpoints.fetchOffer.initiate(id));
          return fetchData.data;
        })
        return out;

      }
    }),

    updateOffer: builder.mutation({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {

        const state= getState();
        let dataToUpdate = await disassemblySlots(state, args, dispatch);
        // console.log("updateOffer",dataToUpdate)

        const out =  await baseUpdateCore(dataToUpdate,marshaller,baseQuery,async (id)=>{
          const fetchData= await dispatch(api.endpoints.fetchOffer.initiate(id,{forceRefetch: true}));
          return fetchData.data;
        });
        // console.log(out);
        return out;
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
  // status: "http%3A%2F%2Flocalhost%3A3000%2Fstatus%2Fbrouillon", // TODO : set default in component
  publishedAt: undefined,

  //Slots
  // slots : []

};





