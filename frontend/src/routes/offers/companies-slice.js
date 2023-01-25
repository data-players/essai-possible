import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../app/api.js";
import {fullCompanies, lightCompaniesList} from "./companies-slice-data.js";

/**
 * COMPANIES SLICE
 */
const companiesAdapter = createEntityAdapter();

const initialState = companiesAdapter.getInitialState({
  status: {},
});

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(matchAny("matchFulfilled", ["fetchCompanies"]), companiesAdapter.upsertMany)
      .addMatcher(matchAny("matchFulfilled", ["fetchCompany"]), companiesAdapter.upsertOne);

    addStatusForEndpoints(builder, ["fetchCompanies", "fetchCompany"]);
  },
});

export default companiesSlice.reducer;

/**
 * COMPANIES SELECTORS
 */

export const selectCompaniesReady = readySelector("companies", "fetchCompanies");
export const selectCompanyReady = readySelector("companies", "fetchCompany");

export const {
  selectAll: selectAllCompanies,
  selectEntities: selectAllCompaniesById,
  selectById: selectCompanyById,
  selectIds: selectCompanyIds,
} = companiesAdapter.getSelectors((state) => state.companies);

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

export const {useFetchCompaniesQuery, useLazyFetchCompanyQuery, useFetchCompanyQuery} = api;
