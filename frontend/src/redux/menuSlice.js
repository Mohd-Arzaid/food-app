import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    loading: false,
    menu: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
  },
});

export const { setLoading, setMenu } = menuSlice.actions;
export default menuSlice.reducer;
