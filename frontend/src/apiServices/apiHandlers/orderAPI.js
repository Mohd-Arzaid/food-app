import { setLoading, setOrderOverview, setOrders } from "@/redux/orderSlice";
import { orderEndpoints } from "../apis";

import { toast } from "sonner";
import { apiConnector } from "../apiconnector";

const {
  CREATE_CHECKOUT_SESSION_API,
  GET_ORDER_DETAILS_API,
  GET_ORDER_OVERVIEW_API,
  UPDATE_ORDER_STATUS_API
} = orderEndpoints;

export const createCheckoutSession = (token, formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        CREATE_CHECKOUT_SESSION_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(
        "CREATE_CHECKOUT_SESSION_API API RESPONSE............",
        response
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Redirect the user to the Stripe payment page
      window.location.href = response.data.session.url;
    } catch (error) {
      console.log("CREATE_CHECKOUT_SESSION_API API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to create checkout session");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getOrderDetails = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ORDER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET_ORDER_DETAILS_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setOrders(response.data.orders));
    } catch (error) {
      console.log("GET_ORDER_DETAILS API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to fetch order details");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getOrderOverview = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ORDER_OVERVIEW_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET_ORDER_OVERVIEW_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setOrderOverview(response.data.orders));
    } catch (error) {
      console.log("GET_ORDER_OVERVIEW_API API ERROR............", error);
      if (error.response && error.response.status === 404) {
        dispatch(setOrderOverview([]));
      } else {
        // Handle other errors
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage || "Failed to fetch order overview");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateOrder = (token, orderId, status) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "PUT",
        `${UPDATE_ORDER_STATUS_API}/${orderId}`, 
        { status },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log("UPDATE_ORDER_STATUS_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Order status updated successfully");
    } catch (error) {
      console.log("UPDATE_ORDER_STATUS_API API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to update order status");
    } finally {
      dispatch(setLoading(false));
    }
  };
};