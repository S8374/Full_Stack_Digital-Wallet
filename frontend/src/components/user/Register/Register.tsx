/* eslint-disable @typescript-eslint/no-explicit-any */
// Registration Component (Register.tsx)
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, User, UserCheck, Shield, Mail, Phone, MapPin, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation, useSendOTPMutation, useVerifyOTPMutation } from "@/redux/features/auth/auth.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      { message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" }
    ),
  confirmPassword: z.string(),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  role: z.enum(["user", "agent"] as const, { message: "Please select a role" }), // ✅ note `as const` and `message`
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<"form" | "verification">("form");
  const [userData, setUserData] = useState<RegisterFormData | null>(null);
  const [userEmail, setUserEmail] = useState("");

  // API mutations
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Step 1: Register the user
      const registerResponse = await register(data).unwrap();

      if (registerResponse.success) {
        // Save user data for potential retry
        setUserData(data);
        setUserEmail(data.email);
        navigate("/")
        // Step 2: Send OTP to the user's email
        await sendOTP({
          email: data.email,
          name: data.name
        }).unwrap();

        // Move to verification step
        setCurrentStep("verification");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);

      if (error.data?.message) {
        setError("root", {
          type: "manual",
          message: error.data.message
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Registration failed. Please try again."
        });
      }
    }
  };

  const handleResendOTP = async () => {
    if (!userData) return;

    try {
      await sendOTP({
        email: userData.email,
        name: userData.name
      }).unwrap();
      toast.success("Verification code has been resent to your email.");
    } catch (error: any) {
      console.error("Resend OTP failed:", error);
      toast.error("Failed to resend verification code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
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
                  Join Our Digital Wallet Platform

                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Experience seamless money transfers, secure transactions, and powerful financial management tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Bank-Level Security</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">256-bit encryption and advanced fraud protection</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Instant Transfers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Send and receive money in seconds, 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Agent Network</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Earn commissions by helping others with cash transactions</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Phone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Mobile First</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Full functionality on any device, anywhere</p>
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
              <CardContent className="">
                {currentStep === "form" ? (
                  <RegistrationForm
                    registerForm={registerForm}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    errors={errors}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    isSubmitting={isRegistering || isSendingOTP}
                    selectedRole={selectedRole}
                  />
                ) : (
                  <VerificationStep
                    email={userEmail}
                    onVerify={verifyOTP}
                    onResend={handleResendOTP}
                    isVerifying={isVerifying}
                    isSendingOTP={isSendingOTP}
                    onBack={() => setCurrentStep("form")}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Registration Form Component
function RegistrationForm({
  registerForm,
  handleSubmit,
  onSubmit,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isSubmitting,
  selectedRole,
}: {
  registerForm: any;
  handleSubmit: any;
  onSubmit: (data: RegisterFormData) => void;
  errors: any;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  isSubmitting: boolean;
  selectedRole: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center ">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Account</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Join thousands of users managing their finances</p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...registerForm("name")}
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
                autoComplete="off"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...registerForm("phone")}
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                className="w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
                autoComplete="off"
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
          </div>
        </div>
        {/* Email Field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...registerForm("email")}
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
                autoComplete="off"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...registerForm("address")}
                id="address"
                placeholder="Enter your full address"
                rows={2}
                className="w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-xl  px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white resize-none"
                autoComplete="off"
              />
            </div>
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
          </div>
        </div>




        {/* Role Selection Field */}
        <div>
          <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Account Type
          </label>
          <select
            {...registerForm("role")}
            id="role"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select account type</option>
            <option value="user">Regular User</option>
            <option value="agent">Agent</option>
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}

          {/* Role description */}
          {selectedRole && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                {selectedRole === 'agent' ? (
                  <>
                    <UserCheck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Agent Account</p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Agents can process cash transactions and earn commissions. Requires admin approval.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">User Account</p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Regular users can send/receive money and use all basic features.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...registerForm("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                className="w-full pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...registerForm("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                className="w-full pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition dark:bg-gray-700 dark:text-white"
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>



        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-500 dark:text-gray-300 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline font-medium">
          Login in here
        </Link>
      </p>
    </motion.div>
  );
}

// Verification Component (unchanged)
function VerificationStep({
  email,
  onVerify,
  onResend,
  isVerifying,
  isSendingOTP,
  onBack,
}: {
  email: string;
  onVerify: (data: { email: string; otp: string }) => Promise<any>;
  onResend: () => void;
  isVerifying: boolean;
  isSendingOTP: boolean;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputRefs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      if (value.length === 6) {
        const newCode = value.split("");
        setVerificationCode(newCode);
        inputRefs[5].current?.focus();
        return;
      }
      return;
    }

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");

    if (code.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    try {
      setError("");
      await onVerify({ email, otp: code });
      toast.success("Your account has been successfully verified!");
      navigate("/login");
    } catch (error: any) {
      console.error("Verification failed:", error);
      setError(error.data?.message || "Invalid verification code. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={onBack}
        className="flex items-center text-gray-500 dark:text-gray-300 mb-6 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to registration
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Verify Your Email</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          We've sent a verification code to <span className="font-medium text-blue-600 dark:text-blue-400">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-4 text-center">
          Enter verification code
        </label>
        <div className="flex justify-center space-x-2">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying || verificationCode.some(digit => digit === "")}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed mb-4"
      >
        {isVerifying ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Verifying...
          </div>
        ) : (
          "Verify Account"
        )}
      </button>

      <p className="text-center text-gray-500 dark:text-gray-300 text-sm">
        Didn't receive the code?{" "}
        <button
          onClick={onResend}
          disabled={isSendingOTP}
          className="text-blue-500 hover:underline font-medium disabled:opacity-50"
        >
          {isSendingOTP ? "Sending..." : "Resend code"}
        </button>
      </p>
    </motion.div>
  );
}