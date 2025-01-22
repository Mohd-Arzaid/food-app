import { useState } from "react";
import { Link } from "react-router-dom";
import { ClockLoader } from "react-spinners";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleForgetPassword = async(e)=>{
    e.preventDefault();
    setLoading(true);
    // Send email
    setEmailSent(true);
    setLoading(false);
    toast.success("Email sent successfully");


  }

  return (
    <div className="flex min-h-[95vh] md:min-h-[100vh] justify-center items-center">
      <div className="border-2 border-black/10 shadow-lg shadow-black/10 w-full max-w-md m-4 md:m-auto p-4 rounded-lg">
        <h1 className="font-semibold text-2xl text-center mb-1">
          Forgot Password
        </h1>
        <p className="text-center text-sm md:text-base mb-2 text-gray-600">
          {emailSent &&
             `We have sent the reset email to ${email}`}
        </p>

        <form onSubmit={handleForgetPassword} className="flex flex-col gap-2">
          {/* Email */}
          {
            !emailSent && (
                <label className="flex flex-col gap-2">
                Email
                <input
                  disabled={loading}
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-transparent fill-none border-2 border-black/20 duration-200 focus:border-green-700 text-black p-2 focus:outline-none rounded-lg"
                />
              </label>
            )
          }
         

          <button
            disabled={loading}
            className="p-3 bg-green-600 text-white cursor-pointer rounded-lg mt-3 font-semibold duration-200"
          >
            {loading ? (
              <div className="flex gap-3 items-center justify-center">
                <ClockLoader size={18} color="#fff" />
                <span>Sending...</span>
              </div>
            ) : !emailSent ? (
              "Send Email"
            ) : (
              "Resend Email"
            )}
          </button>

          <span className="text-center mt-2">
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

export default ForgotPassword;
