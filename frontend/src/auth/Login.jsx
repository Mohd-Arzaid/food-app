import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ClockLoader } from "react-spinners";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { demoLogin, login } from "@/apiServices/apiHandlers/authAPI";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid Email Address.");
      setLoading(false);
      return;
    }

    dispatch(login(email, password, navigate)).finally(() => {
      setLoading(false);
    });
  };

  const handleDemoLogin = (role) => {
    setDemoLoading(role);
    dispatch(demoLogin(role, navigate)).finally(() => {
      setDemoLoading(null);
    });
  };

  const isBusy = loading || Boolean(demoLoading);

  return (
    <div className="flex min-h-[95vh] md:min-h-[100vh] justify-center items-center">
      <div className="border-2 border-black/10 shadow-lg shadow-black/10 w-full max-w-md m-4 md:m-auto p-4 rounded-lg">
        <h1 className="font-semibold text-2xl text-center mb-5">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          {/* Email */}
          <label className="flex flex-col gap-2">
            Email
            <input
              disabled={isBusy}
              required
              type="email"
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
                disabled={isBusy}
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter your password"
                className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg w-full"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </label>

          <div className="flex justify-start mt-3">
            <Link to="/forgot-password" className="text-green-700">
              Forgot Password?
            </Link>
          </div>

          <button
            disabled={isBusy}
            className="p-3 bg-green-600 text-white cursor-pointer rounded-lg mt-3 font-semibold duration-200"
          >
            {loading ? (
              <div className=" flex gap-3 items-center justify-center">
                <ClockLoader size={18} color="#fff" />
                <span>Loading...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>

          <span className="text-center mt-2">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-green-600">
              Signup
            </Link>
          </span>
        </form>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handleDemoLogin("customer")}
            className="p-3 border-2 border-green-600 text-green-700 cursor-pointer rounded-lg font-semibold duration-200 disabled:opacity-60"
          >
            {demoLoading === "customer" ? (
              <div className="flex gap-3 items-center justify-center">
                <ClockLoader size={18} color="#15803d" />
                <span>Loading...</span>
              </div>
            ) : (
              "Continue as customer"
            )}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handleDemoLogin("owner")}
            className="p-3 border-2 border-green-600 text-green-700 cursor-pointer rounded-lg font-semibold duration-200 disabled:opacity-60"
          >
            {demoLoading === "owner" ? (
              <div className="flex gap-3 items-center justify-center">
                <ClockLoader size={18} color="#15803d" />
                <span>Loading...</span>
              </div>
            ) : (
              "Continue as restaurant owner"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
