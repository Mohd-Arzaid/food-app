import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "@/apiServices/apiHandlers/authAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const ForgotPasswordToken = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const resetPasswordToken = location.pathname.split("/").at(-1);
    await dispatch(
      resetPassword(data.password, data.confirmPassword, resetPasswordToken, navigate)
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start sm:justify-center items-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white overflow-x-hidden">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-5 sm:p-8 md:p-10 shadow-sm my-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Set New Password
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Choose a strong new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="New Password"
            placeholder="Enter new password"
            type={showPassword ? "text" : "password"}
            disabled={isSubmitting}
            {...register("password")}
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            }
          />

          <Input
            label="Confirm New Password"
            placeholder="Confirm new password"
            type={showConfirmPassword ? "text" : "password"}
            disabled={isSubmitting}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            }
          />

          <Button
            type="submit"
            className="w-full h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting Password...
              </span>
            ) : (
              "Update Password"
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

export default ForgotPasswordToken;
