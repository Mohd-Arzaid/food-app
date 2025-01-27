import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orders: [],
    orderOverview:[],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setOrderOverview: (state, action) => {
        state.orderOverview = action.payload;
    },
  },
});

export const { setLoading, setOrders, setOrderOverview } = orderSlice.actions;
export default orderSlice.reducer;
