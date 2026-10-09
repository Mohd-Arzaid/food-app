import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Store, User } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { demoLogin, login } from "@/apiServices/apiHandlers/authAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: authLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await dispatch(login(data.email, data.password, navigate));
  };

  const handleDemoLogin = (role) => {
    setDemoLoading(role);
    dispatch(demoLogin(role, navigate)).finally(() => {
      setDemoLoading(null);
    });
  };

  const isBusy = isSubmitting || Boolean(demoLoading);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Login to your account to continue ordering food.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            placeholder="Enter your email address"
            type="email"
            disabled={isBusy}
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            disabled={isBusy}
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

          {/* Forgot password link */}
          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-foreground hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={isBusy}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-foreground hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>

        {/* Demo Logins */}
        <div className="mt-8 pt-6 border-t border-border space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
            Or try with demo account
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-2"
            disabled={isBusy}
            onClick={() => handleDemoLogin("customer")}
          >
            {demoLoading === "customer" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </span>
            ) : (
              <>
                <User size={16} />
                <span>Continue as Demo Customer</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-2"
            disabled={isBusy}
            onClick={() => handleDemoLogin("owner")}
          >
            {demoLoading === "owner" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </span>
            ) : (
              <>
                <Store size={16} />
                <span>Continue as Demo Restaurant Owner</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
