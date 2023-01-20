import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../app/api.js";
import {normalize} from "../../app/utils.js";
import {fullOffers, lightOffersList} from "./offers-slice-data.js";
import {selectAllCompaniesById} from "./companies-slice.js";

/**
 * OFFERS SLICE
 */
const offersAdapter = createEntityAdapter({
  // selectId: (offer) => `${offer.company.name}/${offer.id}`,
  // sortComparer: (a, b) => {
  //     console.log(a.createdAt, b.createdAt, b.createdAt?.localeCompare(a.createdAt));
  //     return b.createdAt?.localeCompare(a.createdAt)
  // },
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
      .addMatcher(matchAny("matchFulfilled", ["fetchOffer"]), offersAdapter.upsertOne);

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

// Apply the filter selection to the offers list
// More on selector memoization : https://react-redux.js.org/api/hooks#using-memoizing-selectors / https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions
export const selectFilteredOffersIds = createSelector(
  [
    selectAllOffers,
    selectAllCompaniesById,
    (state, {search}) => search,
    (state, {location}) => location,
    (state, {radius}) => radius,
    (state, {sectors}) => sectors,
    (state, {goals}) => goals,
  ],
  (offers, companiesById, search, location, radius, sectors, goals) => {
    const hasSearch = search !== "";
    const hasLocalizationText = location !== "";
    const hasSectors = sectors?.length > 0;
    const hasGoals = goals?.length > 0;
    const hasAnyFilter = hasSearch || hasLocalizationText || hasSectors || hasGoals;

    const searchInFields = (fields, search) =>
      fields.find((field) => normalize(field).includes(normalize(search)));

    const matchInArray = (elementArray, filterArray) => {
      return filterArray.find((option) => elementArray.includes(option));
    };

    const filteredOffers = hasAnyFilter
      ? offers.filter((offer) => {
          const company = companiesById[offer.company] || {};
          console.log(hasSectors && matchInArray(company.sectors, sectors));

          return (
            (!hasSearch ||
              searchInFields([offer.title, company.name, offer.description], search)) &&
            (!hasLocalizationText || searchInFields([offer.location], location)) &&
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
      query: () => `/breeds?limit=1`,
      // query: () => "offers",
      transformResponse() {
        // Mock data with offers
        return lightOffersList;
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one offer by id
    fetchOffer: builder.query({
      query: () => `/breeds?limit=1`,
      // query: (id) => `offers/${id}`,
      transformResponse(baseQueryReturnValue, meta, id) {
        // Mock data with offers
        return fullOffers.find((offer) => offer.id === id);
      },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});

export const {useFetchOffersQuery, useFetchOfferQuery} = api;
