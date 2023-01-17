import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {selectCurrentUser} from "../../app/auth-slice.js";
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

// Apply the user filter selection to the offers list
// More on selector memoization : https://react-redux.js.org/api/hooks#using-memoizing-selectors / https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions
export const selectFilteredOffersIds = createSelector(
  [
    selectAllOffers,
    selectAllCompaniesById,
    (state, searchText, locationText, radius) => searchText,
    (state, searchText, locationText, radius) => locationText,
    (state, searchText, locationText, radius) => radius,
  ],
  (offers, companiesById, searchText, locationText, radius) => {
    const hasSearchText = searchText !== "";
    const hasLocalizationText = locationText !== "";

    const searchInFields = (fields, searchText) =>
      fields.find((field) => normalize(field).includes(normalize(searchText)));

    const filteredOffers =
      hasSearchText || hasLocalizationText
        ? offers.filter((offer) => {
            const {title, description, location} = offer;
            const companyName = companiesById[offer.company]?.name;

            return (
              (!hasSearchText || searchInFields([title, companyName, description], searchText)) &&
              (!hasLocalizationText || searchInFields([location], locationText))
            );
          })
        : offers;

    return filteredOffers.map((offer) => offer.id);
  }
);

export const selectOffersForUser = createSelector(
  [selectAllOffers, (state) => selectCurrentUser(state)?.id],
  (offers, currentUserId) => offers.filter((offer) => offer.user === currentUserId)
);

/**
 * OFFERS API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the list of all offers
    fetchOffers: builder.query({
      query() {
        return `/breeds?limit=1`;
      },
      transformResponse() {
        // Mock data with offers
        return lightOffersList;
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one offer by id
    fetchOffer: builder.query({
      query(id) {
        return `/breeds?limit=10`;
      },
      transformResponse(baseQueryReturnValue, meta, id) {
        // Mock data with offers
        return fullOffers.find((offer) => offer.id === id);
      },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});

export const {useFetchOffersQuery, useFetchOfferQuery} = api;
