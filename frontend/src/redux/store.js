import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import profileSlice from "./profileSlice";
import restaurantSlice from "./restaurantSlice";
import menuSlice from "./menuSlice";
import cartSlice from "./cartSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "food-app-storage-key",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  profile: profileSlice,
  restaurant: restaurantSlice,
  menu: menuSlice,
  cart: cartSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
