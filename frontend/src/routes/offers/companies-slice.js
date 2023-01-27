import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../app/apiMiddleware.js";
import {fullCompanies, lightCompaniesList} from "./companies-slice-data.js";
import * as yup from "yup";
import {requiredArray, requiredString, requiredUrl} from "../../app/fieldValidation.js";

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
      .addMatcher(matchAny("matchFulfilled", ["fetchCompany"]), companiesAdapter.upsertOne)
      .addMatcher(matchAny("matchFulfilled", ["updateCompany"]), companiesAdapter.upsertOne)
      .addMatcher(matchAny("matchFulfilled", ["addCompany"]), companiesAdapter.addOne)
      .addMatcher(matchAny("matchFulfilled", ["deleteCompany"]), companiesAdapter.removeOne);

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
        return `/organizations`;
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
        return `/organizations`;
      },
      transformResponse(baseQueryReturnValue, meta, id) {
        // Mock data with companies
        return fullCompanies.find((company) => company.id === id);
      },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    addCompany: builder.mutation({
      query: (company) => {
        return "/organizations";
      },
      // query: ({slot, comments}) => ({
      //   url: "companies",
      //   method: "POST",
      //   body: {slot, comments},
      // }),
      transformResponse(baseResponse, meta, company) {
        // Mock data
        const res = {...company, id: fullCompanies.length + 1};
        return res;
      },
    }),

    updateCompany: builder.mutation({
      query: () => "/organizations",
      // query: (companyPatch) => ({
      //   url: "companies",
      //   method: "PATCH",
      //   body: companyPatch,
      // }),
      transformResponse(baseQueryReturnValue, meta, companyPatch) {
        // Mock data
        let company = fullCompanies.find((company) => company.id === companyPatch.id);
        return {...company, ...companyPatch};
      },
    }),

    deleteCompany: builder.mutation({
      query: (id) => "/organizations",
      // query: (id) => ({
      //   url: `company`,
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
  useFetchCompaniesQuery,
  useLazyFetchCompanyQuery,
  useFetchCompanyQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = api;

/**
 * COMPANY VALIDATION SCHEMA
 */

export const companyValidationSchema = yup.object({
  name: requiredString,
  description: requiredString,
  sectors: requiredArray,
  website: requiredUrl,
});

export const companyDefaultValues = {name: "", description: "", website: "", sectors: []};
