// PasswordChange Component - Secure password update functionality
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { validation } from "../utils/validation";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

const PasswordChange = ({ onClose }) => {
  const { user, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    const passwordError = validation.password(formData.newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(formData.currentPassword, formData.newPassword);

      if (result.success) {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setTimeout(() => {
          onClose && onClose();
        }, 2000);
      } else {
        setErrors({ general: result.message || "Failed to update password" });
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-400 mb-2">Password Updated!</h3>
        <p className="text-gray-300">Your password has been changed successfully.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
        <h2 className="text-xl font-semibold">Change Password</h2>
        <p className="text-sm text-gray-400">Enter your current password and choose a new one</p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="flex items-center gap-2 text-sm opacity-80 mb-2">
            <Lock size={16} />
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.currentPassword ? "border-red-500" : "border-white/20"
              } rounded-xl focus:outline-none focus:border-cyan-500 transition pr-12`}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="flex items-center gap-2 text-sm opacity-80 mb-2">
            <Lock size={16} />
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.newPassword ? "border-red-500" : "border-white/20"
              } rounded-xl focus:outline-none focus:border-cyan-500 transition pr-12`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="flex items-center gap-2 text-sm opacity-80 mb-2">
            <Lock size={16} />
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.confirmPassword ? "border-red-500" : "border-white/20"
              } rounded-xl focus:outline-none focus:border-cyan-500 transition pr-12`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="text-xs text-gray-400 bg-white/5 p-3 rounded-lg">
          <p className="font-medium mb-2">Password Requirements:</p>
          <ul className="space-y-1">
            <li className={`flex items-center gap-2 ${formData.newPassword.length >= 8 ? 'text-green-400' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              At least 8 characters
            </li>
            <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-400' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              One uppercase letter
            </li>
            <li className={`flex items-center gap-2 ${/[a-z]/.test(formData.newPassword) ? 'text-green-400' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.newPassword) ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              One lowercase letter
            </li>
            <li className={`flex items-center gap-2 ${/\d/.test(formData.newPassword) ? 'text-green-400' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(formData.newPassword) ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              One number
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-500 hover:bg-gray-400 transition text-white font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PasswordChange;
