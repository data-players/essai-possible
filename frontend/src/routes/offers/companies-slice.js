import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {selectCurrentUser} from "../../app/auth-slice.js";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../app/api.js";
import {normalize} from "../../app/utils.js";
import {fullCompanies, lightCompaniesList} from "./companies-slice-data.js";

/**
 * COMPANIES SLICE
 */
const companiesAdapter = createEntityAdapter({
  // selectId: (company) => `${company.company.name}/${company.id}`,
  // sortComparer: (a, b) => {
  //     console.log(a.createdAt, b.createdAt, b.createdAt?.localeCompare(a.createdAt));
  //     return b.createdAt?.localeCompare(a.createdAt)
  // },
});

const initialState = companiesAdapter.getInitialState({
  status: "idle",
});

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(matchAny("matchFulfilled", ["fetchCompanies"]), companiesAdapter.upsertMany)
      .addMatcher(matchAny("matchFulfilled", ["fetchCompany"]), companiesAdapter.upsertOne);

    addStatusForEndpoints(builder, ["fetchCompanies"]);
  },
});

export default companiesSlice.reducer;

/**
 * COMPANIES SELECTORS
 */

export const selectCompaniesReady = readySelector("companies");

export const {
  selectAll: selectAllCompanies,
  selectById: selectCompanyById,
  selectIds: selectCompanyIds,
} = companiesAdapter.getSelectors((state) => state.companies);

// Apply the user filter selection to the companies list
// More on selector memoization : https://react-redux.js.org/api/hooks#using-memoizing-selectors / https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions
export const selectFilteredCompaniesIds = createSelector(
  [
    selectAllCompanies,
    (state, searchText, locationText, radius) => searchText,
    (state, searchText, locationText, radius) => locationText,
    (state, searchText, locationText, radius) => radius,
  ],
  (companies, searchText, locationText, radius) => {
    const hasSearchText = searchText !== "";
    const hasLocalizationText = locationText !== "";

    const searchInFields = (fields, searchText) =>
      fields.find((field) => normalize(field).includes(normalize(searchText)));

    const filteredCompanies =
      hasSearchText || hasLocalizationText
        ? companies.filter((item) => {
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
        : companies;

    return filteredCompanies.map((company) => company.id);
  }
);

export const selectCompaniesForUser = createSelector(
  [selectAllCompanies, (state) => selectCurrentUser(state)?.id],
  (companies, currentUserId) => companies.filter((company) => company.user === currentUserId)
);

/**
 * COMPANIES API ENDPOINTS
 */

api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the list of all companies
    fetchCompanies: builder.query({
      query() {
        return `/breeds?limit=1`;
      },
      transformResponse() {
        // Mock data with companies
        return lightCompaniesList;
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one company by id
    fetchCompany: builder.query({
      query(id) {
        return `/breeds?limit=10`;
      },
      transformResponse(baseQueryReturnValue, meta, id) {
        // Mock data with companies
        return fullCompanies.find((company) => company.id === id);
      },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});

export const {useFetchCompaniesQuery, useFetchCompanyQuery} = api;
