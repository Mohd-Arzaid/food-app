import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ClockLoader } from "react-spinners";
import { toast } from "sonner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const [showPassword, setShowPassword] = useState(false);

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

    toast.success("Login Successful");
    console.log(formData);
    setLoading(false);
  };

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
              disabled={loading}
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
                disabled={loading}
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
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>

          <div className="flex justify-start mt-3">
            <Link to="/forgot-password" className="text-green-700">
              Forgot Password?
            </Link>
          </div>

          <button
            disabled={loading}
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
      </div>
    </div>
  );
};

export default Login;
