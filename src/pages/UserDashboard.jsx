// UserDashboard.jsx - Dashboard for regular users (non-admin)
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { dashboardApi } from "../services/apiService";
import { Sun, Moon, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Activity, Users } from "lucide-react";
import {
  AreaChart, Area, CartesianGrid, Tooltip, XAxis, ResponsiveContainer, BarChart, Bar, YAxis
} from "recharts";

// Import Sidebar component
import Sidebar from '../components/Sidebar';

// StatCard COMPONENT
const StatCard = ({ label, value, change, green, darkMode, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-5 rounded-2xl shadow-xl border transition ${
      darkMode ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm opacity-70">{label}</p>
      {icon && <div className="text-cyan-400">{icon}</div>}
    </div>
    <h2 className="text-3xl font-bold text-cyan-400 mt-1">{value}</h2>
    <p className={`mt-1 text-sm ${green ? "text-green-400" : "text-red-400"}`}>
      {change}
    </p>
  </motion.div>
);

// GLASS CARD COMPONENT
const GlassCard = ({ title, children, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-6 rounded-2xl shadow-xl border transition ${
      darkMode ? "bg-white/10 backdrop-blur-lg border-white/20" : "bg-white border-gray-200"
    }`}
  >
    <h2 className="font-semibold mb-4">{title}</h2>
    {children}
  </motion.div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [data, setData] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      let result;
      if (selectedSection === "dashboard") result = await dashboardApi.getDashboardData();
      else if (selectedSection === "analytics") result = await dashboardApi.getAnalyticsData();
      else if (selectedSection === "usage") result = await dashboardApi.getCloudUsageData();

      if (result.success) {
        setData(result.data);
      }
    };

    loadData();
  }, [selectedSection]);

  if (!data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gray-100 text-gray-900"
      }`}>
        <p className="text-xl animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  // Filter data based on user's department
  const userDepartment = user?.department;
  const departmentData = data.departments?.find(dept => dept.name === userDepartment) || {};

  // Dashboard view for users
  const dashboardView = (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-slate-400">Here's your department's cloud usage overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Your Department"
          value={userDepartment || "N/A"}
          change="Active"
          green
          darkMode={darkMode}
          icon={<Users size={20} />}
        />
        <StatCard
          label="Daily Usage Hours"
          value={departmentData.hours || 0}
          change="+2h today"
          green
          darkMode={darkMode}
          icon={<Activity size={20} />}
        />
        <StatCard
          label="Services Used"
          value={departmentData.services?.length || 0}
          change="Active"
          green
          darkMode={darkMode}
          icon={<DollarSign size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Department Services" darkMode={darkMode}>
          <div className="space-y-4">
            {departmentData.services?.map((service, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                <span className="font-medium">{service}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-400">Active</span>
                </div>
              </div>
            )) || (
              <p className="text-slate-400 text-center py-4">No services assigned to your department</p>
            )}
          </div>
        </GlassCard>

        <GlassCard title="Usage Trends" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.chart?.slice(-6) || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#ffffff22" : "#00000022"} />
              <XAxis dataKey="month" stroke={darkMode ? "#fff" : "#000"} />
              <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none" }} />
              <Area type="monotone" dataKey="spend" stroke="#38bdf8" fill="#0ea5e9" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard title="Recent Activity" darkMode={darkMode} className="mt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <Activity size={16} />
            </div>
            <div className="flex-1">
              <p className="font-medium">Compute resources scaled up</p>
              <p className="text-sm text-slate-400">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <div className="flex-1">
              <p className="font-medium">Storage usage optimized</p>
              <p className="text-sm text-slate-400">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
            <div className="flex-1">
              <p className="font-medium">Budget threshold approaching</p>
              <p className="text-sm text-slate-400">1 day ago</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </>
  );

  // Analytics view for users
  const analyticsView = (
    <>
      <h2 className="text-2xl font-semibold mb-6">Your Usage Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Department Performance" darkMode={darkMode}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Utilization Rate</span>
              <span className="font-semibold text-cyan-400">78%</span>
            </div>
            <div className="flex justify-between">
              <span>Efficiency Score</span>
              <span className="font-semibold text-green-400">92%</span>
            </div>
            <div className="flex justify-between">
              <span>Cost per Hour</span>
              <span className="font-semibold text-yellow-400">$2.45</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Monthly Trends" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.chart?.slice(-4) || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#ffffff22" : "#00000022"} />
              <XAxis dataKey="month" stroke={darkMode ? "#fff" : "#000"} />
              <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none" }} />
              <Bar dataKey="spend" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </>
  );

  // Usage view for users
  const usageView = (
    <>
      <h2 className="text-2xl font-semibold mb-6">Resource Usage</h2>
      <GlassCard title="Your Department's Resources" darkMode={darkMode}>
        <div className="space-y-4">
          {departmentData.services?.map((service, index) => {
            const usageData = data.services?.find(s => s.name === service);
            return (
              <div key={index} className="p-4 rounded-lg bg-slate-700/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{service}</h3>
                  <span className="text-sm text-cyan-400">{usageData?.usage || "Active"}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">75% of allocated capacity</p>
              </div>
            );
          }) || (
            <p className="text-slate-400 text-center py-4">No resources assigned to your department</p>
          )}
        </div>
      </GlassCard>
    </>
  );

  return (
    <div className={`min-h-screen flex transition-all pl-64 ${
      darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      <Sidebar
        darkMode={darkMode}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold tracking-wide">
            {darkMode ? "👤 User Dashboard" : "📊 My Dashboard"}
          </h1>
          <button
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        {selectedSection === "dashboard" && dashboardView}
        {selectedSection === "analytics" && analyticsView}
        {selectedSection === "usage" && usageView}
      </main>
    </div>
  );
};

export default UserDashboard;