import { setLoading, setToken } from "@/redux/authSlice";
import { endpoints } from "../apis";
import { toast } from "sonner";
import { apiConnector } from "../apiconnector";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export const sendOtp = (email, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      // console.log("SEND OTP API RESPONSE............", response);
      // console.log(response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("OTP sent successfully to your Email Address");
      navigate("/verify-email");
    } catch (error) {
      // console.log("SEND OTP API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Send OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const signUp = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      // console.log("SIGNUP API RESPONSE............", response);
      // console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Account Created Successfully");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Create Account");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const login = (email, password, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      // console.log("LOGIN API RESPONSE............", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Welcome back! You have Logged in Successfully.");
      dispatch(setToken(response.data.token));
      // const userImage = response.data?.user?.image
      //   ? response.data.user.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      // dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      // console.log("LOGIN API ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Login");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getPasswordResetToken = (email, setEmailSent) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      // console.log("RESET PASSWORD TOKEN RESPONSE....", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Password Email Sent Successfully");

      setEmailSent(true);
    } catch (error) {
      // console.log("RESET PASSWORD TOKEN Error", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Send Reset Password Email");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const resetPassword = (
  password,
  confirmPassword,
  resetPasswordToken
) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        resetPasswordToken,
      });
      //console.log("RESET PASSWORD RESPONSE ... ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage || "Failed to Reset Password");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const logout = (navigate, isProfileDeleted = false) => {
  return (dispatch) => {
    dispatch(setToken(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (!isProfileDeleted) {
      toast.success("You have been logged out successfully.");
    }
    navigate("/");
  };
};
