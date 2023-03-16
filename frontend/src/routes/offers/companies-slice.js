import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import api, {
  addStatusForEndpoints,
  baseCreateMutation,
  baseUpdateMutation,
  baseUpdateCore,
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
    askedAffiliation : "ep:hasAskedAffiliation",
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
    objectArrayFields: ["offers", "affiliates", "askedAffiliation", "sectors"],
    encodeUriFields: ["offers", "affiliates", "askedAffiliation", "sectors"],
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
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        // console.log('fetchOffer',args);
        const baseResponse = await baseQuery({
          url: decodeURIComponent(args),
        });
        const data = marshaller.marshall(baseResponse.data);
        // console.log('company',data)
        const affiliates= [];
        for (const item of data.affiliates) {
          // console.log('get slot',slot)
          const result = await dispatch(api.endpoints.fetchUser.initiate(item));
          affiliates.push(result.data)
          // console.log(slotData.data);
        }
        const askedAffiliation= [];
        for (const item of data.askedAffiliation) {
          // console.log('get slot',slot)
          const result = await dispatch(api.endpoints.fetchUser.initiate(item));
          askedAffiliation.push(result.data)
          // console.log(slotData.data);
        }



        const finalData = {
          ...data,
          affiliates, 
          askedAffiliation
        }
        // console.log('finalData',finalData)
        return {
          data:finalData
        }
      },     
      keepUnusedDataFor: 200, // Keep cached data for X seconds after the query hook is not used anymore.
    }),

    addCompany: builder.mutation({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        let dataToUpdate ={
          ...args,
          affiliates:args.affiliates?.map(a=>a.id),
          askedAffiliation: args.askedAffiliation?.map(a=>a.id)
        }

        return await baseCreateCore(dataToUpdate,marshaller,baseQuery,"/jobs","https://data.essai-possible.data-players.com/context.json",async (id)=>{
          const fetchData= await dispatch(api.endpoints.fetchCompany.initiate(id));
          return fetchData.data;
        })

      }
      
    }),

    updateCompany: builder.mutation({
      queryFn: async (args, {getState,dispatch}, extraOptions, baseQuery) => {
        let dataToUpdate ={
          ...args,
          affiliates:args.affiliates?.map(a=>a.id),
          askedAffiliation: args.askedAffiliation?.map(a=>a.id)
        }
  
        const out =  await baseUpdateCore(dataToUpdate,marshaller,baseQuery,async (id)=>{
          const fetchData= await dispatch(api.endpoints.fetchCompany.initiate(id,{forceRefetch: true}));
          return fetchData.data;
        });
        return out;
      }
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
