import { createSlice } from "@reduxjs/toolkit";

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: {
    loading: false,
    restaurant: null,
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
        state.restaurant.menus = [...(state.restaurant.menus || []), action.payload];
      }
    },
  },
});

export const { setLoading, setRestaurant,addMenuToRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
