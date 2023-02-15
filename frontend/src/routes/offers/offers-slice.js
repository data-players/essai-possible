import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector,  baseCreateMutation, baseUpdateMutation} from "../../app/apiMiddleware.js";
import {normalize, sorter} from "../../app/utils.js";
import {fullOffers, lightOffersList, statusOptions} from "./offers-slice-data.js";
import {selectAllCompaniesById} from "./companies-slice.js";
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
 * Skills SELECTORS
 */

export const selectSkillsReady = readySelector("skills", "fetchSkills");

export const {selectAll: selectAllSkills} = skillsAdapter.getSelectors((state) => state.skills);

/**
 * Status SELECTORS
 */

export const selectStatussReady = readySelector("status", "fetchStatus");

export const {selectAll: selectAllStatus} = statusAdapter.getSelectors((state) => state.status);


/**
 * Offers Mashaller
 */

const marshaller = createJsonLDMarshaller(
  {
    title : "pair:label",
    description: "pair:description",
    company : "pair:offeredBy",
    softSkills: "pair:hasSkills",
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
    particularConditions:"ep:particularConditions",
    possibleArrangements:"ep:possibleArrangements",
    slots:"ep:subjectOf"

  },
  {
    objectArrayFields: ["softSkills","slots"],
    encodeUriFields: ["softSkills","company","status","slots"],
    defaultValues:[
      {
        key : "type",
        value : "ep:Job" 
      }
    ]
  }
);

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


// Apply the filter selection to the offers list
// More on selector memoization : https://react-redux.js.org/api/hooks#using-memoizing-selectors / https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions
export const selectFilteredOffersIds = createSelector(
  [
    (state) => selectAllOffers(state).filter((offer) => offer.status === statusOptions[1]),
    selectAllCompaniesById,
    (state, {search}) => search,
    (state, {location}) => location,
    (state, {radius}) => radius,
    (state, {sectors}) => sectors,
    (state, {goals}) => goals,
  ],
  (offers, companiesById, search, location, radius, sectors, goals) => {
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

/**
 * OFFERS API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the list of all offers
    fetchOffers: builder.query({
      query: () => `/jobs`,
      transformResponse(baseResponse, meta) {
        return baseResponse["ldp:contains"].map((company) => marshaller.marshall(company));
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one offer by id
    fetchOffer: builder.query({
      query: (id) => {
        return decodeURIComponent(id);
      },
      transformResponse(baseResponse, meta, arg) {
        // Mock data with companies
        return marshaller.marshall(baseResponse);
      },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),


    addOffer: builder.mutation({
      queryFn: baseCreateMutation(marshaller, "jobs"),
    }),

    updateOffer: builder.mutation({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {

        const state= getState();
        const existing=state.offers.entities[args.id];
        console.log('existing',existing);
        const oldSlots=existing.slots;
        console.log ('new',args)
        const newSlots = args.slots;

        for (const newSlot of newSlots) {
          // console.log('newSlot',newSlot);
          // console.log('state.slots',state.slots);
          if (!newSlot.id){
            const createdSlot= await dispatch(api.endpoints.addSlot.initiate({
              start : newSlot.start,
              offer : args.id
            }));
            console.log('createdSlot',createdSlot)
          }
        }

        const newSlotWithId = newSlots.fiter(s=>s.id!=undefined).map(s=>s.id);
        const slotsToDelete=existing.slots.map(s=>s.id).filter(s=>!newSlotWithId.includes(s));
        for (const slotToDelete of slotsToDelete) {
          const deletedSlot= await dispatch(api.endpoints.removeSlot.initiate(slotToDelete));
        }

        const body = marshaller.unmarshall(args);
        await baseQuery({
          url: body.id,
          method: "PUT",
          body: body,
        });
        const data = (await baseQuery(body.id)).data;
        const marshallData = marshaller.marshall(data);
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


export const {
  useFetchOffersQuery,
  useFetchOfferQuery,
  useAddOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useFetchSkillsQuery,
  useFetchStatusQuery,
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
  status: "Brouillon",
  publishedAt: undefined,
};
