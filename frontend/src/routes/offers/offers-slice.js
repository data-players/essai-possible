import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../app/apiMiddleware.js";
import {normalize, sorter} from "../../app/utils.js";
import {fullOffers, lightOffersList, statusOptions} from "./offers-slice-data.js";
import {selectAllCompaniesById} from "./companies-slice.js";
import * as yup from "yup";
import {
  required,
  requiredArray,
  requiredEmail,
  requiredNumber,
  requiredPhone,
  requiredString,
} from "../../app/fieldValidation.js";

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

export const selectOfferIdsForCompany = (state, companyId) =>
  selectAllOffers(state)
    .filter((offer) => offer.company === companyId)
    .map((offer) => offer.id);

export const {
  selectAll: selectAllOffers,
  selectById: selectOfferById,
  selectIds: selectOfferIds,
} = offersAdapter.getSelectors((state) => state.offers);

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
      // query: () => "offers",
      transformResponse() {
        // Mock data with offers
        return lightOffersList;
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one offer by id
    fetchOffer: builder.query({
      query: () => `/jobs`,
      // query: (id) => `offers/${id}`,
      transformResponse(baseQueryReturnValue, meta, id) {
        // Mock data with offers
        return fullOffers.find((offer) => offer.id === id);
      },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    addOffer: builder.mutation({
      query: (offer) => {
        return "/jobs";
      },
      // query: ({slot, comments}) => ({
      //   url: "offers",
      //   method: "POST",
      //   body: {slot, comments},
      // }),
      transformResponse(baseResponse, meta, offer) {
        // Mock data
        const res = {...offer, id: fullOffers.length + 1};
        return res;
      },
    }),

    updateOffer: builder.mutation({
      query: () => "/jobs",
      // query: (offerPatch) => ({
      //   url: "offers",
      //   method: "PATCH",
      //   body: offerPatch,
      // }),
      transformResponse(baseQueryReturnValue, meta, offerPatch) {
        // Mock data
        let offer = fullOffers.find((offer) => offer.id === offerPatch.id);
        return {...offer, ...offerPatch};
      },
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

  //Modalities
  duration: requiredNumber,
  timeSchedule: requiredString,
  location: required,

  // Mentor contact
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

  //Modalities
  duration: undefined,
  timeSchedule: "",
  location: null,
  particularConditions: "",
  possibleArrangements: "",

  // Mentor contact
  mentorPhone: "",
  mentorEmail: "",

  // Status
  status: "Brouillon",
  publishedAt: undefined,
};
