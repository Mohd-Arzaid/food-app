import { sendOtp, signUp } from "@/apiServices/apiHandlers/authAPI";
import { ArrowLeft, Loader2, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      isRestaurantOwner,
    } = signupData;

    dispatch(
      signUp(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        isRestaurantOwner,
        navigate
      )
    ).finally(() => {
      setLoading(false);
    });
  };

  const handleResendOtp = () => {
    setResendLoading(true);
    dispatch(sendOtp(signupData?.email, navigate)).finally(() => {
      setResendLoading(false);
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start sm:justify-center items-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white overflow-x-hidden">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-5 sm:p-8 md:p-10 shadow-sm my-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Verify Your Email
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to{" "}
            <span className="font-semibold text-foreground">
              {signupData?.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerifyEmail} className="space-y-6">
          <div className="py-2 flex justify-center">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  className="w-10 sm:w-11 md:w-12 h-11 sm:h-12 md:h-14 border border-border bg-background rounded-lg text-foreground font-bold text-lg sm:text-xl text-center focus:border-primary focus:outline-none transition-colors"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 4px",
                width: "100%",
                maxWidth: "320px",
              }}
            />
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full h-12"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying Code...
              </span>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="flex items-center justify-between text-sm pt-2">
            <Link
              to="/signup"
              className="flex items-center gap-1 font-medium text-foreground hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Signup</span>
            </Link>

            <button
              type="button"
              disabled={resendLoading}
              onClick={handleResendOtp}
              className="flex items-center gap-1.5 font-medium text-foreground hover:underline cursor-pointer disabled:opacity-50"
            >
              <Timer className="w-4 h-4" />
              <span>{resendLoading ? "Resending..." : "Resend OTP"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
