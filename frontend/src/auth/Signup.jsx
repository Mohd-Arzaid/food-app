import { sendOtp } from "@/apiServices/apiHandlers/authAPI";
import { setSignupData } from "@/redux/authSlice";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ClockLoader } from "react-spinners";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { firstName, lastName, email, password, confirmPassword } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid Email Address.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    const signupData = {
      ...formData,
    };

    dispatch(setSignupData(signupData));

    dispatch(sendOtp(formData.email, navigate)).finally(() => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setLoading(false);
    });
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="border-2 border-black/10 shadow-lg shadow-black/10 w-full max-w-md m-4 md:m-auto p-4 rounded-lg">
        <h1 className="font-semibold text-2xl text-center mb-5">
          Create an Account
        </h1>

        <form onSubmit={handleSignIn} className="flex flex-col gap-2">
          {/* First Name */}
          <label className="flex flex-col gap-2">
            First Name
            <input
              disabled={loading}
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter your first name"
              className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg"
            />
          </label>

          {/* Last Name */}
          <label className="flex flex-col gap-2">
            Last Name
            <input
              disabled={loading}
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter your last name"
              className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col gap-2">
            Email
            <input
              disabled={loading}
              required
              type="text"
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter your email address"
              className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg"
            />
          </label>

          {/* Password */}
          <label className="flex flex-col gap-2">
            Password
            <div className="relative">
              <input
                disabled={loading}
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Create Your Password"
                className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg w-full"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </label>

          {/* Confirm Password */}
          <label className="flex flex-col gap-2">
            Confirm Password
            <div className="relative">
              <input
                disabled={loading}
                required
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg w-full"
              />
              <button
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </label>

          <button
            disabled={loading}
            className="p-3 bg-green-600 text-white cursor-pointer rounded-lg mt-3 font-semibold duration-200"
          >
            {loading ? (
              <div className="flex gap-3 items-center justify-center">
                <ClockLoader size={18} color="#fff" />
                <span>Loading...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>

          <span className="text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
