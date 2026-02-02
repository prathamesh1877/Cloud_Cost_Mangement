// Signup/Registration Page
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validation } from "../utils/validation";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    phone: "",
    role: "user"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    setSignupError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    const nameError = validation.name(formData.name);
    const emailError = validation.email(formData.email);
    const passwordError = validation.password(formData.password);
    const confirmPasswordError = validation.confirmPassword(formData.password, formData.confirmPassword);
    const departmentError = validation.required(formData.department, "Department");

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    if (departmentError) newErrors.department = departmentError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSignupError("");

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setSignupError(result.message || "Registration failed");
      }
    } catch (error) {
      setSignupError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          🚀 Create Account
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">
          Join us to manage your cloud costs efficiently
        </p>

        {signupError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
            {signupError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm opacity-80">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-3 bg-white/10 border ${
                errors.name ? "border-red-500" : "border-white/20"
              } rounded-xl focus:outline-none focus:border-cyan-500 transition`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm opacity-80">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-3 bg-white/10 border ${
                errors.email ? "border-red-500" : "border-white/20"
              } rounded-xl focus:outline-none focus:border-cyan-500 transition`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm opacity-80">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-3 bg-white/10 border ${
                errors.department ? "border-red-500" : "border-white/20"
              } rounded-xl focus:outline-none focus:border-cyan-500 transition`}
            >
              <option value="" className="bg-slate-800">Select Department</option>
              <option value="DevOps" className="bg-slate-800">DevOps</option>
              <option value="AI Team" className="bg-slate-800">AI Team</option>
              <option value="Frontend" className="bg-slate-800">Frontend</option>
              <option value="Backend" className="bg-slate-800">Backend</option>
              <option value="Marketing" className="bg-slate-800">Marketing</option>
              <option value="IT" className="bg-slate-800">IT</option>
            </select>
            {errors.department && (
              <p className="mt-1 text-xs text-red-400">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="text-sm opacity-80">Phone (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-cyan-500 transition"
              placeholder="1234567890"
            />
          </div>

          <div>
            <label className="text-sm opacity-80">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-3 bg-white/10 border ${
                errors.password ? "border-red-500" : "border-white/20"
              } rounded-xl focus:outline-none focus:border-cyan-500 transition`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-sm opacity-80">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-3 bg-white/10 border ${
                errors.confirmPassword ? "border-red-500" : "border-white/20"
              } rounded-xl focus:outline-none focus:border-cyan-500 transition`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
