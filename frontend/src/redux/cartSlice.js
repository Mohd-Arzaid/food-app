import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        // If item already exists in cart, increment its quantity
        existingItem.quantity += 1;
      } else {
        // If item does not exist in cart, add it with quantity 1
        state.cart.push({ ...item, quantity: 1 });
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    removeFromTheCart: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter((item) => item._id !== id);
    },
    incrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.cart.find((item) => item._id === id);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.cart.find((item) => item._id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

export const { addToCart, clearCart, removeFromTheCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;