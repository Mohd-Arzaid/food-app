import { sendOtp } from "@/apiServices/apiHandlers/authAPI";
import { setSignupData } from "@/redux/authSlice";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUpSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
    lastName: z.string().trim().min(2, "Last name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(6, "Confirm password is required."),
    accountType: z.enum(["customer", "owner"], {
      errorMap: () => ({ message: "Please choose an account type." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "customer",
    },
  });

  const selectedAccountType = watch("accountType");

  const onSubmit = async (data) => {
    const isRestaurantOwner = data.accountType === "owner";
    const signupData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      isRestaurantOwner,
    };

    dispatch(setSignupData(signupData));
    await dispatch(sendOtp(data.email, navigate));
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Food App and discover delicious food or start your restaurant.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. John"
              disabled={isSubmitting}
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              placeholder="e.g. Doe"
              disabled={isSubmitting}
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            disabled={isSubmitting}
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            placeholder="Create password"
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
            label="Confirm Password"
            placeholder="Confirm your password"
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

          {/* Account Type Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="text-sm font-medium text-foreground block">
              I want to register as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                  selectedAccountType === "customer"
                    ? "border-[#1f2937] bg-gray-50 text-foreground font-semibold"
                    : "border-border text-muted-foreground hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  value="customer"
                  className="sr-only"
                  {...register("accountType")}
                />
                <span>Customer</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                  selectedAccountType === "owner"
                    ? "border-[#1f2937] bg-gray-50 text-foreground font-semibold"
                    : "border-border text-muted-foreground hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  value="owner"
                  className="sr-only"
                  {...register("accountType")}
                />
                <span>Restaurant Owner</span>
              </label>
            </div>
            {errors.accountType?.message && (
              <p className="text-destructive text-xs font-medium">
                {errors.accountType.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-foreground hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
