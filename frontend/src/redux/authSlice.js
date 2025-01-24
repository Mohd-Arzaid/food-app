import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    signupData: null,
    loading: false,
    token: localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSignupData: (state, action) => {
      state.signupData = action.payload;
    },
  },
});

export const { setLoading, setSignupData, setToken } = authSlice.actions;
export default authSlice.reducer;