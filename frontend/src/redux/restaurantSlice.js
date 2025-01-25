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
  },
});

export const { setLoading, setRestaurant, addMenuToRestaurant , updateMenuInRestaurant  } =
  restaurantSlice.actions;
export default restaurantSlice.reducer;
