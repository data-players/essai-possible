import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {
  addStatusForEndpoints,
  baseCreateMutation,
  baseUpdateMutation,
  matchAny,
  readySelector,
} from "../../app/apiMiddleware.js";
import * as yup from "yup";
import {requiredArray, requiredString, requiredUrl} from "../../app/fieldValidation.js";
import {createJsonLDMarshaller} from "./../../app/utils.js";

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
 * Companies Mashaller
 */
const marshaller = createJsonLDMarshaller(
  {
    affiliates: "pair:affiliates",
    description: "pair:description",
    hasLocation: "pair:hasLocation",
    name: "pair:label",
    offers: "pair:offers",
    website: "pair:homePage",
    sectors: "pair:hasSectors",
    siret: "ep:siret",
    type: "type",
    image: "image",
  },
  {
    objectArrayFields: ["offers", "affiliates", "sectors"],
    encodeUriFields: ["offers", "affiliates", "sectors"],
    defaultValues:[
      {
        key : "type",
        value : "pair:Organization" 
      }
    ]
  }
);

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
      transformResponse(baseResponse, meta) {
        return baseResponse["ldp:contains"].map((company) => marshaller.marshall(company));
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one company by id
    fetchCompany: builder.query({
      query: (id) => {
        //log volontaire de controle, suspition que l'id arrive parfait pas encodé
        // console.log("fetchCompany id", id);
        return decodeURIComponent(id);
      },
      transformResponse(baseResponse, meta, arg) {
        // Mock data with companies
        return marshaller.marshall(baseResponse);
      },
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    addCompany: builder.mutation({
      queryFn: baseCreateMutation(marshaller, "organizations"),
    }),

    updateCompany: builder.mutation({
      queryFn: baseUpdateMutation(marshaller),
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
    // Fetch the list of all companies
    fetchSector: builder.query({
      query() {
        return `/sectors`;
      },
      transformResponse(baseResponse, meta) {
        return baseResponse["ldp:contains"].map((company) => marshaller.marshall(company));
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),
  }),
});


/**
 * export api hooks
 */

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
  website: requiredUrl,
  sectors: requiredArray,
});

export const companyDefaultValues = {name: "", description: "", website: "", sectors: []};
