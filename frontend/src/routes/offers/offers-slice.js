import {createSlice, createSelector, createEntityAdapter} from "@reduxjs/toolkit";
import api from "../../app/api.js";

const offersAdapter = createEntityAdapter({
  // sortComparer: (a, b) => {
  //     console.log(a.createdAt, b.createdAt, b.createdAt?.localeCompare(a.createdAt));
  //     return b.createdAt?.localeCompare(a.createdAt)
  // },
});

const initialState = offersAdapter.getInitialState();

const offersSlice = createSlice({
  name: "offers",
  initialState,
  extraReducers(builder) {},
});

export default offersSlice.reducer;

export const {
  selectAll: selectAllOffers,
  selectById: selectOfferById,
  selectIds: selectOfferIds,
} = offersAdapter.getSelectors((state) => state.offers);

export const selectOffersByUser = createSelector(
  [selectAllOffers, (state, userId) => userId],
  (offers, userId) => offers.filter((offer) => offer.user === userId)
);
