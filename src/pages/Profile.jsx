// Profile Page - User profile management
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { validation } from "../utils/validation";
import { User, Mail, Building, Phone, Edit, Save, X, Camera } from "lucide-react";
import UserAvatar from "../components/UserAvatar";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    phone: user?.phone || "",
    avatar: user?.avatar || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    // Validate form
    const newErrors = {};
    const nameError = validation.name(formData.name);
    const emailError = validation.email(formData.email);
    const departmentError = validation.required(formData.department, "Department");

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (departmentError) newErrors.department = departmentError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
      phone: user?.phone || "",
      avatar: user?.avatar || ""
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-wide">👤 Profile Settings</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-xl transition text-black font-medium"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 rounded-xl transition text-white font-medium disabled:opacity-50"
                >
                  <Save size={16} />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded-xl transition text-white font-medium"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="md:col-span-1">
              <div className="text-center">
                <UserAvatar
                  user={user}
                  size={120}
                  className="justify-center mb-4"
                />
                {isEditing && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition mx-auto">
                    <Camera size={16} />
                    Change Photo
                  </button>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm opacity-80 mb-2">
                    <User size={16} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.name ? "border-red-500" : "border-white/20"
                      } rounded-xl focus:outline-none focus:border-cyan-500 transition`}
                    />
                  ) : (
                    <p className="px-4 py-3 bg-white/5 rounded-xl">{user?.name || "Not set"}</p>
                  )}
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm opacity-80 mb-2">
                    <Mail size={16} />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.email ? "border-red-500" : "border-white/20"
                      } rounded-xl focus:outline-none focus:border-cyan-500 transition`}
                    />
                  ) : (
                    <p className="px-4 py-3 bg-white/5 rounded-xl">{user?.email || "Not set"}</p>
                  )}
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="flex items-center gap-2 text-sm opacity-80 mb-2">
                    <Building size={16} />
                    Department
                  </label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.department ? "border-red-500" : "border-white/20"
                      } rounded-xl focus:outline-none focus:border-cyan-500 transition`}
                    >
                      <option value="">Select Department</option>
                      <option value="DevOps">DevOps</option>
                      <option value="AI Team">AI Team</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Marketing">Marketing</option>
                      <option value="IT">IT</option>
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-white/5 rounded-xl">{user?.department || "Not set"}</p>
                  )}
                  {errors.department && <p className="mt-1 text-xs text-red-400">{errors.department}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm opacity-80 mb-2">
                    <Phone size={16} />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Optional"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-white/5 rounded-xl">{user?.phone || "Not set"}</p>
                  )}
                </div>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="text-sm opacity-80 mb-2 block">Role</label>
                <p className="px-4 py-3 bg-white/5 rounded-xl capitalize">{user?.role || "User"}</p>
              </div>

              {/* Account Info */}
              <div className="pt-6 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="opacity-70">Account Created:</span>
                    <p className="font-medium">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="opacity-70">Last Login:</span>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
