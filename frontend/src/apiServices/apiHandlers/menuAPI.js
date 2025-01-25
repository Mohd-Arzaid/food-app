import { setLoading, setMenu } from "@/redux/menuSlice";
import { apiConnector } from "../apiconnector";
import { menuEndpoints } from "../apis";
import { toast } from "sonner";
import { addMenuToRestaurant, updateMenuInRestaurant } from "@/redux/restaurantSlice";

const { ADD_MENU_API, EDIT_MENU_API } = menuEndpoints;

export const createMenu = (token, formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", ADD_MENU_API, formData, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });

      // console.log("CREATE MENU API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message || "Menu Created Successfully");
      dispatch(setMenu(response.data.menu));

      // Add the new menu to the restaurant state
      dispatch(addMenuToRestaurant(response.data.menu));
    } catch (error) {
      console.log("CREATE MENU API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Create Menu");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const editMenu = (token, menuId, formData) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("PUT", `${EDIT_MENU_API}/${menuId}`, formData, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });

      // console.log("EDIT MENU API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message || "Menu Edit Successfully");
      dispatch(setMenu(response.data.menu));

      // update restaurant menu
      dispatch(updateMenuInRestaurant(response.data.menu));
    } catch (error) {
      console.log("EDIT MENU API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Edit Menu");
    } finally {
      dispatch(setLoading(false));
    }
  };
};
