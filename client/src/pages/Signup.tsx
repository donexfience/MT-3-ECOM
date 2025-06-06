import { useState } from "react";
import { signupSchema, type SignupFormData } from "../utils/schema/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import bgImage from "../assets/bg.png";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/auth";
import { toast } from "react-fox-toast";
import type { AxiosError } from "axios";
import { useUserStore } from "../store/user";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const response = await signup(data);
      if (response?.data) {
        console.log(response, "res");
        setUser(response.data.user);
        toast.success(response?.message);
        navigate("/home");
      }

      reset();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error(axiosError, "axios error");
      const message =
        axiosError.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div
        className="flex-1 bg-cover bg-center relative overflow-hidden flex items-center justify-center h-1/2 md:h-auto"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="text-center text-white z-10 px-4 sm:px-6 md:px-8">
          <div className="mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-400 opacity-60 mx-auto mb-4 md:mb-6 transform rotate-45"></div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Welcome Back!
          </h1>
          <p className="text-blue-100 mb-6 md:mb-8 text-base md:text-lg leading-relaxed max-w-xs sm:max-w-sm md:max-w-md">
            To keep connected with us please
            <br />
            login with your personal info
          </p>

          <button
            onClick={handleSignIn}
            className="px-6 py-2 md:px-8 md:py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            SIGN IN
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-0">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">
              Create Account
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <div className="relative">
              <div className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400">
                <User size={18} />
              </div>
              <input
                {...register("name")}
                type="text"
                placeholder="Name"
                className={`w-full pl-10 pr-4 py-2.5 md:pl-12 md:py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className={`w-full pl-10 pr-4 py-2.5 md:pl-12 md:py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-10 pr-10 py-2.5 md:pl-12 md:pr-12 md:py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 md:py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
