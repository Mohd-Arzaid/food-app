import { createSlice } from "@reduxjs/toolkit";

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: {
    loading: false,
    restaurant: null,
    searchedRestaurant: null,
    appliedFilter: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRestaurant: (state, action) => {
      state.restaurant = action.payload;
    },
    // Reducer to add menu to restaurant
    addMenuToRestaurant: (state, action) => {
      if (state.restaurant) {
        state.restaurant.menus = [
          ...(state.restaurant.menus || []),
          action.payload,
        ];
      }
    },
    updateMenuInRestaurant: (state, action) => {
      if (state.restaurant) {
        state.restaurant.menus = state.restaurant.menus.map((menu) =>
          menu._id === action.payload._id ? action.payload : menu
        );
      }
    },
    setSearchedRestaurant: (state, action) => {
      state.searchedRestaurant = action.payload;
    },
    setAppliedFilter: (state, action) => {
      const value = action.payload;
      // Ensure appliedFilter is an array
      if (!Array.isArray(state.appliedFilter)) {
        state.appliedFilter = [];
      }
      const isAlreadyApplied = state.appliedFilter.includes(value);
      // Create the updated filter array based on whether the value is already applied or not
      state.appliedFilter = isAlreadyApplied
        ? state.appliedFilter.filter((item) => item !== value)
        : [...state.appliedFilter, value];
    },
    resetAppliedFilter: (state) => {
      state.appliedFilter = [];
    },
  },
});

export const {
  setLoading,
  setRestaurant,
  addMenuToRestaurant,
  updateMenuInRestaurant,
  setSearchedRestaurant,
  setAppliedFilter,
  resetAppliedFilter
} = restaurantSlice.actions;
export default restaurantSlice.reducer;
