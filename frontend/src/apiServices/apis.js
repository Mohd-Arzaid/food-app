const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/user/sendotp",
  SIGNUP_API: BASE_URL + "/user/signup",
  LOGIN_API: BASE_URL + "/user/login",
  RESETPASSTOKEN_API: BASE_URL + "/user/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/user/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/user/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteAccount",
};

// RESTAURANT ENDPOINTS
export const restaurantEndpoints = {
  ADD_RESTAURANT_API: BASE_URL + "/restaurant/createRestaurant",
  GET_RESTAURANT_API: BASE_URL + "/restaurant/getRestaurant",
  UPDATE_RESTAURANT_API: BASE_URL + "/restaurant/updateRestaurant",
  SEARCH_RESTAURANT_API: BASE_URL + "/restaurant/searchRestaurant",
  GET_SINGLE_RESTAURANT_API: BASE_URL + "/restaurant/getSingleRestaurant",
};

// MENU ENDPOINTS
export const menuEndpoints = {
  ADD_MENU_API: BASE_URL + "/menu/createMenu",
  EDIT_MENU_API: BASE_URL + "/menu/editMenu",
};