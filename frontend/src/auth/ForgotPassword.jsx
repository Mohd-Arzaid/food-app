import { getPasswordResetToken } from "@/apiServices/apiHandlers/authAPI";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Loader2, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmittedEmail(data.email);
    await dispatch(getPasswordResetToken(data.email, setEmailSent));
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          {emailSent ? (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <MailCheck className="h-7 w-7" />
            </div>
          ) : null}

          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {emailSent ? "Check Your Email" : "Forgot Password"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {emailSent
              ? `We have sent password reset instructions to ${submittedEmail}`
              : "Enter your registered email address and we will send you a reset link."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {!emailSent && (
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              disabled={isSubmitting}
              {...register("email")}
              error={errors.email?.message}
            />
          )}

          <Button
            type="submit"
            className="w-full h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Link...
              </span>
            ) : emailSent ? (
              "Resend Reset Email"
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-foreground hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
