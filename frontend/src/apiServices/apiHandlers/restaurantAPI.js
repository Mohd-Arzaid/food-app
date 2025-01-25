import {
  setLoading,
  setRestaurant,
  setSearchedRestaurant,
} from "@/redux/restaurantSlice";
import { apiConnector } from "../apiconnector";
import { restaurantEndpoints } from "../apis";
import { toast } from "sonner";

const {
  ADD_RESTAURANT_API,
  GET_RESTAURANT_API,
  UPDATE_RESTAURANT_API,
  SEARCH_RESTAURANT_API,
} = restaurantEndpoints;

export const createRestaurant = (token, formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        ADD_RESTAURANT_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      // console.log("CREATE RESTAURANT API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message || "Restaurant Created Successfully");
    } catch (error) {
      console.log("CREATE RESTAURANT API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Create Restaurant");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getRestaurant = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_RESTAURANT_API, null, {
        Authorization: `Bearer ${token}`,
      });

      // console.log("GET RESTAURANT API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setRestaurant(response.data.restaurant));
    } catch (error) {
      console.log("FETCH RESTAURANT DETAILS API ERROR............", error);
      // const errorMessage =
      //   error.response?.data?.message || "Something went wrong";

      // toast.error(errorMessage || "Failed to fetch Restaurant");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateRestaurant = (token, formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_RESTAURANT_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      // console.log("UPDATE RESTAURANT API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message || "Restaurant Updated Successfully");
    } catch (error) {
      console.log("UPDATE RESTAURANT API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Update Restaurant");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const searchRestaurant = (searchText, searchQuery, selectedCuisines,token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.set("searchQuery", searchQuery);
      }
      if (selectedCuisines && selectedCuisines.length > 0) {
        params.set("selectedCuisines", selectedCuisines.join(","));
      }

      const url = searchText
        ? `${SEARCH_RESTAURANT_API}/${searchText}?${params.toString()}`
        : `${SEARCH_RESTAURANT_API}?${params.toString()}`;

      const response = await apiConnector("GET", url, null, {
        Authorization: `Bearer ${token}`,
      });

      console.log("SEARCH RESTAURANT API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setSearchedRestaurant(response.data));
    } catch (error) {
      console.log("SEARCH RESTAURANT API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to search restaurants");
    } finally {
      dispatch(setLoading(false));
    }
  };
};
