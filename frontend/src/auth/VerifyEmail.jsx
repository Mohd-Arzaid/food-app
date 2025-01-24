import { sendOtp, signUp } from "@/apiServices/apiHandlers/authAPI";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader, ClockLoader } from "react-spinners";
import { toast } from "sonner";

const VerifyEmail = () => {
  const { signupData } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [navigate, signupData]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    // Validate OTP
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    const { firstName, lastName, email, password, confirmPassword } =
      signupData;

    dispatch(
      signUp(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    ).finally(() => {
      setLoading(false);
    });
  };

  const handleResendOtp = () => {
    setResendLoading(true);
    dispatch(sendOtp(signupData.email, navigate)).finally(() => {
      setResendLoading(false);
    });
  };

  return (
    <div className="flex min-h-[95vh] md:min-h-[100vh] justify-center items-center">
      <div className="border-2 border-black/10 shadow-lg shadow-black/10 w-full max-w-md m-4 md:m-auto p-4 rounded-lg">
        <h1 className="font-semibold text-2xl text-center mb-1 md:mb-2">
          Verify Your Email
        </h1>
        <p className="text-center text-sm md:text-base mb-5 text-gray-600">
          Please enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleVerifyEmail} className="flex flex-col gap-5 mt-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                placeholder="-"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-[40px] md:w-[48px] lg:w-[60px] border border-gray-600 bg-white rounded-[0.5rem] text-[#1e3a8a] text-bold text-2xl aspect-square text-center focus:border-0 focus:outline-2 focus:outline-[#1e3a8a]"
              />
            )}
            containerStyle={{
              justifyContent: "space-between",
              gap: "0 8px",
            }}
          />
          <Separator className="border-t-2 md:my-2 border-black/20 w-full" />

          <button
            disabled={loading}
            className="p-3 bg-green-600 text-white cursor-pointer rounded-lg font-semibold duration-200"
          >
            {loading ? (
              <div className="flex gap-3 items-center justify-center">
                <ClockLoader size={18} color="#fff" />
                <span>Loading...</span>
              </div>
            ) : (
              "Verify Email"
            )}
          </button>

          <div className="mt-1 flex items-center justify-between">
            <Link
              to="/signup"
              className="flex items-center gap-1 text-green-600 hover:text-green-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Signup</span>
            </Link>

            <button
              disabled={resendLoading}
              onClick={handleResendOtp}
              className="flex items-center gap-1 text-green-600 hover:text-green-700"
            >
              {resendLoading ? (
                <ClipLoader size={15} className="mx-1" color="#388E3C" />
              ) : (
                <Timer className="w-4 h-4" />
              )}
              <p>{resendLoading ? "Sending..." : "Resend OTP"}</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
