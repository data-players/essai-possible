import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {addStatusForEndpoints, matchAny, readySelector} from "../../app/apiMiddleware.js";
import {fullCompanies, lightCompaniesList} from "./companies-slice-data.js";
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

const marshaller = createJsonLDMarshaller(
  {
    affiliates: "pair:affiliates",
    description: "pair:description",
    hasLocation: "pair:hasLocation",
    name: "pair:label",
    offers: "pair:offers",
    website : "pair:homePage",
    type: "type",
    image: "image",
  },
  {
    objectArrayFields: ["offers", "affiliates"],
    encodeUriFields:["offers", "affiliates"]
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
        return baseResponse['ldp:contains'].map(company=>marshaller.marshall(company))
      },
      keepUnusedDataFor: 500, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    // Fetch one company by id
    fetchCompany: builder.query({
      query: (id) => {
        return decodeURIComponent(id);
      },
      transformResponse(baseResponse, meta, arg) {
        // Mock data with companies
        return marshaller.marshall(baseResponse);
      },
      // queryFn: async (id, {getState}, extraOptions, baseQuery) => {
      //   let entity = getState().companies.entities[id];
      //   if (!entity) {
      //     entity = (await baseQuery({url:id,method:'POST'})).data;
      //   }
      //   const data = marshaller.marshall(entity);
      //   return {data: data};
      // },
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
      queryFn: async (args, {getState}, extraOptions, baseQuery) => {
        console.log('args',args);
        const body = marshaller.unmarshall(args);
        console.log('body',body);
        await baseQuery({
          url:body.id,
          method:'PUT',
          body:body
        });
        console.log('body.id',body.id);
        const data = (await baseQuery(body.id)).data;
        const out= marshaller.marshall(data);
        console.log('updateCompany out',out);
        return {data: out};
      },

      // query: (args) => ({
      //   url: decodeURIComponent(args.id),
      //   method: "PUT",
      //   body: marshaller.unmarshall(args),
      // }),
      // transformResponse(baseQueryReturnValue, meta, args) {
      //   // Mock data
      //   // console.log('api',api);
      //   // console.log('baseQueryReturnValue',baseQueryReturnValue);
      //   // let company = fullCompanies.find((company) => company.id === args.id);
      //   console.log('end update -> math remove',args);
      //   return args.id;
      // },
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
