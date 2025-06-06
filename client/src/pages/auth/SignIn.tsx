import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import bgImage from "../../assets/bg.png";
import { validateEmail } from "../../utils/validation/email";
import { useNavigate } from "react-router-dom";
import { signin } from "../../services/auth";
import { useUserStore } from "../../store/user";
import { toast } from "react-fox-toast";
import type { AxiosError } from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Form submitted:", formData);
      const response = await signin(formData);
      if (response?.data) {
        setUser(response.data.user);
        toast.success(response?.message);
        navigate("/home");
      }
      setFormData({ email: "", password: "" });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-white flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-orange-400 mb-2">
              Sign In to
            </h2>
            <h2 className="text-4xl font-bold text-orange-400">Your Account</h2>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-7 transform -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-700 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-4 top-7 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-700 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                forgot password?
              </span>
            </div>

            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-full font-bold text-white text-sm tracking-wide transition-all duration-300 transform hover:scale-105 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-400 hover:bg-orange-500 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="text-center text-white z-10 px-8 relative">
          <h1 className="text-5xl font-bold mb-6">Hello Friend!</h1>
          <p className="text-blue-100 mb-10 text-lg leading-relaxed max-w-md mx-auto">
            Enter your personal details and
            <br />
            start your journey with us
          </p>

          <button
            onClick={handleSignUp}
            className="px-12 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 text-sm tracking-wide"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
