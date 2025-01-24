import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ClockLoader } from "react-spinners";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/apiServices/apiHandlers/authAPI";
const ForgotPasswordToken = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const resetPasswordToken = location.pathname.split("/").at(-1);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    dispatch(
      resetPassword(password, confirmPassword, resetPasswordToken, navigate)
    ).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex min-h-[95vh] md:min-h-[100vh] justify-center items-center">
      <div className="border-2 border-black/10 shadow-lg shadow-black/10 w-full max-w-md m-4 md:m-auto p-4 rounded-lg">
        <h1 className="font-semibold text-2xl text-center mb-5">
          Choose your password
        </h1>
        <form onSubmit={handleResetPassword} className="flex flex-col gap-2">
          {/* New Password */}
          <label className="flex flex-col gap-2">
            New Password
            <div className="relative">
              <input
                disabled={loading}
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter new password"
                className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm new password"
                className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg w-full"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                <span>Resetting Password...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </button>

          <span className="text-center ">
            Remember your password?{" "}
            <Link to="/login" className="text-green-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};
export default ForgotPasswordToken;
