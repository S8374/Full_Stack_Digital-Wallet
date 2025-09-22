/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated SignIn.tsx with professional design matching register page
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Shield, Phone } from "lucide-react";
import { useForgetPasswordMutation, useLoginMutation } from "@/redux/features/auth/auth.api";
import GoogleSignInButton from "../GoogleSignInButton";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom"

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Types derived from schemas
type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Login Component
export default function SignIn() {
  const [step, setStep] = useState<"login" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgetPasswordMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmitLogin = async (data: LoginFormData) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
navigate('/')
      console.log("Login successful:", result);
      // Handle successful login (redirect, store token, etc.)

    } catch (err: any) {
      console.error("Login failed:", err);

      if (err.data?.message) {
        setError("root", {
          type: "manual",
          message: err.data.message
        });
      } else {
        setError("root", {
          type: "manual",
          message: "An error occurred during login. Please try again."
        });
      }
    }
  };

  const onSubmitForgot = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();

      // Show success message (same message regardless of whether email exists for security)
      toast.success("If an account exists with this email, you will receive password reset instructions.");

      // Reset form and go back to login
      resetForgotForm();
      setStep("login");

    } catch (error: any) {
      console.error("Forgot password error:", error);

      // Even if there's an error, show the same success message for security reasons
      toast.success("If an account exists with this email, you will receive password reset instructions.");

      resetForgotForm();
      setStep("login");
    }
  };

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full ">


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 dark:text-white">
                  Welcome Back to Your Digital Wallet
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Access your account to manage your finances, send money, and track transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Secure Transactions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Bank-level security for all your financial operations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Instant Transfers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Send and receive money in seconds, 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">No Hidden Fees</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Transparent pricing with no surprise charges</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Multi-Device Access</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Access your account from any device, anywhere</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {step === "login" && (
                    <LoginStep
                      register={register}
                      handleSubmit={handleSubmit}
                      onSubmitLogin={onSubmitLogin}
                      errors={errors}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      isLoading={isLoading}
                      setStep={setStep}
                      variants={variants}
                    />
                  )}

                  {step === "forgot" && (
                    <ForgotPasswordStep
                      registerForgot={registerForgot}
                      handleForgotSubmit={handleForgotSubmit}
                      onSubmitForgot={onSubmitForgot}
                      forgotErrors={forgotErrors}
                      isForgotLoading={isForgotLoading}
                      resetForgotForm={resetForgotForm}
                      setStep={setStep}
                      variants={variants}
                    />
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Login Step Component
function LoginStep({
  register,
  handleSubmit,
  onSubmitLogin,
  errors,
  showPassword,
  setShowPassword,
  isLoading,
  setStep,
  variants,
}: any) {
  return (
    <motion.div
      key="login"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sign In to Your Account</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Welcome back! Please enter your details</p>
      </div>
      <Link
        to="/"
        className="flex items-center text-gray-500 dark:text-gray-300 mb-6 text-sm hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>
      {errors.root && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">
            {errors.root.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-gray-600 dark:text-gray-300">
            <input
              {...register("rememberMe")}
              type="checkbox"
              className="h-4 w-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
            />
            <span className="ml-2 text-sm">Remember Me</span>
          </label>
          <button
            type="button"
            onClick={() => setStep("forgot")}
            className="text-blue-500 text-sm hover:underline font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing In...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">Or continue with</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      {/* Google Sign-In Button */}
      <GoogleSignInButton />

      <p className="mt-6 text-center text-gray-500 dark:text-gray-300 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 hover:underline font-medium">
          Register Now Here
        </Link>
      </p>
    </motion.div>
  );
}

// Forgot Password Step Component
function ForgotPasswordStep({
  registerForgot,
  handleForgotSubmit,
  onSubmitForgot,
  forgotErrors,
  isForgotLoading,
  resetForgotForm,
  setStep,
  variants,
}: any) {
  return (
    <motion.div
      key="forgot"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => {
          resetForgotForm();
          setStep("login");
        }}
        className="flex items-center text-gray-500 dark:text-gray-300 mb-6 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to login
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Reset Your Password</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Enter your email to receive password reset instructions
        </p>
      </div>

      <form onSubmit={handleForgotSubmit(onSubmitForgot)} className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              {...registerForgot("email")}
              type="email"
              id="forgot-email"
              placeholder="Enter your email"
              className="w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
            />
          </div>
          {forgotErrors.email && (
            <p className="mt-1 text-sm text-red-500">{forgotErrors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isForgotLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isForgotLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-500 dark:text-gray-300 text-sm">
        Remember your password?{" "}
        <button
          onClick={() => setStep("login")}
          className="text-blue-500 hover:underline font-medium"
        >
          Back to login
        </button>
      </p>
    </motion.div>
  );
}