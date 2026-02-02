// Sidebar.jsx
import React from "react";
import { Home, BarChart2, Cloud, Settings, LogOut, Users2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Sidebar = ({ darkMode, selectedSection, setSelectedSection }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const items = [
    { icon: <Home />, label: "Dashboard", value: "dashboard" },
    { icon: <BarChart2 />, label: "Analytics", value: "analytics" },
    { icon: <Cloud />, label: "Cloud Usage", value: "cloudUsage" },
    { icon: <Settings />, label: "Settings", value: "settings" },
    { icon: <Users2 />, label: "Users", value: "users" }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 p-6 border-r transition-colors duration-300 overflow-y-auto
      ${darkMode ? "bg-white/5 border-white/10 text-white backdrop-blur-xl" : "bg-white border-gray-200 text-gray-900"}`}>
      
      {/* User Info Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
            <p className="text-xs opacity-70 truncate">{user?.role || "Role"}</p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6 tracking-wide">⚡ CloudCost</h1>
      
      <div className="space-y-2">
        {items.map((i) => (
          <motion.div
            whileHover={{ x: 5 }}
            key={i.label}
            onClick={() => setSelectedSection(i.value)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
              ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}
              ${selectedSection === i.value ? "bg-cyan-500/30" : ""}
            `}
          >
            {i.icon}
            <span className="text-base">{i.label}</span>
          </motion.div>
        ))}
      </div>
    
      <div className="absolute bottom-10 left-6 right-6">
        <motion.div
          whileHover={{ x: 5 }}
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 cursor-pointer opacity-80 rounded-xl
            hover:bg-red-500/20 transition"
        >
          <LogOut />
          <span>Logout</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
