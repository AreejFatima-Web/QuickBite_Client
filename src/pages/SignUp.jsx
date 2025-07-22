import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const SignUp = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[#$%^&*()_+=]/.test(email);
  };

  const validatePassword = (password) => {
    // return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    return  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      return setError("Invalid email format.");
    }

    if (!validatePassword(formData.password)) {
      return setError("Password must be at least 8 characters long and include both letters, Special characters, and numbers.");
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      if (response.data.success) {
        // navigate("/login");
        navigate("/verify-notice", { state: { email: formData.email } });
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="mt-12"></div>
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <div className={`p-8 ${isDarkMode ? "bg-gray-900" : "bg-[#ff66b2]"}`}>
            <h2 className={`text-2xl font-bold text-center ${isDarkMode ? "text-[#ff66b2]" : "text-white"}`}>
              Create Your Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
            )}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none ${
                  isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Your Name"
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none ${
                  isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none ${
                  isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Minimum 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                isLoading
                  ? "bg-[#ff66b2]/70 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-[#ff66b2] hover:bg-[#d44480]"
                    : "bg-[#ff66b2] hover:bg-[#d44480]"
              } text-white`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus className="mr-2" />
                  Sign Up
                </>
              )}
            </button>

            <div className={`mt-6 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{" "}
              <Link
                to="/login"
                className={`font-medium ${isDarkMode ? "text-[#ff66b2] hover:text-[#d44480]" : "text-[#ff66b2] hover:text-[#d44480]"}`}
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default SignUp;