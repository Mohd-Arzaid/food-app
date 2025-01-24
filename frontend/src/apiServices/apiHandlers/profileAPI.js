import { setLoading, setUser } from "@/redux/profileSlice";
import { profileEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { toast } from "sonner";

const { 
    UPDATE_PROFILE_API, 
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API
  } = profileEndpoints;

  export const updateProfile = (token, formData) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
      try {
        const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        });
        console.log("UPDATE_PROFILE_API API RESPONSE............", response);
  
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        const userImage = response.data.updatedUserDetails.image
          ? response.data.updatedUserDetails.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`;
        dispatch(
          setUser({ ...response.data.updatedUserDetails, image: userImage })
        );
        toast.success("Profile Updated Successfully");
      } catch (error) {
        console.log("UPDATE_PROFILE_API API ERROR............", error);
        const errorMessage =
        error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage || "Failed to Update Profile");
      } finally {
        dispatch(setLoading(false));
      }
    };
  };