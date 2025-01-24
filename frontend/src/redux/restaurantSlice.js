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
  },
});

export const { setLoading, setRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
