// CloudDashboard.jsx - Admin Dashboard with full CRUD operations using Axios
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, XCircle, CheckCircle, Edit, Save, Plus, TrendingUp, TrendingDown, AlertTriangle, Users, Filter } from "lucide-react";
import {
  AreaChart, Area, CartesianGrid, Tooltip, XAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, YAxis
} from "recharts";

// Import components and hooks
import Sidebar from '../components/Sidebar';
import { useAuth } from "../context/AuthContext";
import RoleBasedUI, { useRoleAccess } from "../components/RoleBasedUI";
import { dashboardApi, userApi, departmentApi } from "../services/apiService";

// StatCard Component
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

// GlassCard Component
const GlassCard = ({ title, children, darkMode, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-6 rounded-2xl shadow-xl border transition ${
      darkMode ? "bg-white/10 backdrop-blur-lg border-white/20" : "bg-white border-gray-200"
    } ${className}`}
  >
    <h2 className="font-semibold mb-4">{title}</h2>
    {children}
  </motion.div>
);

const CloudDashboard = () => {
  const { user } = useAuth();
  const { isAdmin } = useRoleAccess();

  // State management
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data based on selected section
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        let result;

        switch (selectedSection) {
          case "dashboard":
            result = await dashboardApi.getDashboardData();
            break;
          case "analytics":
            result = await dashboardApi.getAnalyticsData();
            break;
          case "cloudUsage":
            result = await dashboardApi.getCloudUsageData();
            break;
          case "settings":
            result = await dashboardApi.getSettingsData();
            break;
          case "users":
            // Load both users and departments for users section
            const [usersResult, deptsResult] = await Promise.all([
              userApi.getUsers(),
              departmentApi.getDepartments()
            ]);
            setUsers(usersResult.success ? usersResult.data : []);
            setDepartments(deptsResult.success ? deptsResult.data : []);
            result = await dashboardApi.getDashboardData(); // For department data
            if (result.success && deptsResult.success) {
              result.data.departments = deptsResult.data;
            }
            break;
          default:
            result = await dashboardApi.getDashboardData();
        }

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || "Failed to load data");
        }
      } catch (err) {
        setError("Network error occurred");
        console.error("Data loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedSection]);

  // Handle budget request approval/rejection
  const handleBudgetAction = async (requestId, action) => {
    try {
      const result = action === 'approve'
        ? await dashboardApi.approveBudgetRequest(requestId)
        : await dashboardApi.rejectBudgetRequest(requestId);

      if (result.success) {
        // Refresh data
        const refreshResult = await dashboardApi.getDashboardData();
        if (refreshResult.success) {
          setData(refreshResult.data);
        }
      } else {
        setError(`Failed to ${action} budget request`);
      }
    } catch (err) {
      setError("Failed to process budget request");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gray-100 text-gray-900"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gray-100 text-gray-900"
      }`}>
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Dashboard view
  const dashboardView = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Cloud Spend"
          value={`$${data?.stats?.totalSpend || 0}`}
          change="+12%"
          green
          darkMode={darkMode}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          label="Compute Cost"
          value={`$${data?.stats?.compute || 0}`}
          change="-5%"
          darkMode={darkMode}
          icon={<TrendingDown size={20} />}
        />
        <StatCard
          label="Storage Cost"
          value={`$${data?.stats?.storage || 0}`}
          change="+8%"
          green
          darkMode={darkMode}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          label="Network Cost"
          value={`$${data?.stats?.network || 0}`}
          change="+22%"
          green
          darkMode={darkMode}
          icon={<TrendingUp size={20} />}
        />
      </div>

      <GlassCard title="Cloud Spend Timeline" darkMode={darkMode} className="mt-8">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data?.chart || []}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#ffffff22" : "#00000022"} />
            <XAxis dataKey="month" stroke={darkMode ? "#fff" : "#000"} />
            <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none" }} />
            <Area type="monotone" dataKey="spend" stroke="#38bdf8" fill="#0ea5e9" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <GlassCard title="Top Expensive Services" darkMode={darkMode}>
          <div className="space-y-4">
            {(data?.services || [])
              .filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()))
              .map((s) => (
                <div key={s.name} className="flex justify-between">
                  <span>{s.name}</span>
                  <span className="font-semibold text-cyan-400">${s.value}</span>
                </div>
              ))}
          </div>
        </GlassCard>

        <GlassCard title="Cost Breakdown Radar" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={data?.radar || []}>
              <PolarGrid />
              <PolarAngleAxis dataKey="service" stroke={darkMode ? "#fff" : "#000"} />
              <PolarRadiusAxis stroke={darkMode ? "#aaa" : "#555"} />
              <Radar name="Cost" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <RoleBasedUI allowedRoles={['admin', 'manager']}>
          <GlassCard title="Budget Requests" darkMode={darkMode}>
            <div className="space-y-4">
              {[
                { id: 1, name: "DevOps Team", cost: "$500", status: "pending" },
                { id: 2, name: "AI Team", cost: "$1200", status: "pending" },
                { id: 3, name: "Frontend Team", cost: "$300", status: "pending" }
              ].map((r) => (
                <div key={r.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm opacity-70">Request: {r.cost}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBudgetAction(r.id, 'approve')}
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition"
                      title="Approve"
                    >
                      <CheckCircle size={16} className="text-green-400" />
                    </button>
                    <button
                      onClick={() => handleBudgetAction(r.id, 'reject')}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition"
                      title="Reject"
                    >
                      <XCircle size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </RoleBasedUI>
      </div>
    </>
  );

  // Analytics view
  const analyticsView = (
    <>
      <h2 className="text-2xl font-semibold mb-6">Usage Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Performance Stats" darkMode={darkMode}>
          <div className="space-y-4">
            {(data?.usageStats || []).map((s) => (
              <div key={s.metric} className="flex justify-between py-2">
                <span>{s.metric}</span>
                <span className="font-semibold text-cyan-400">{s.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Usage Trends" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#ffffff22" : "#00000022"} />
              <XAxis dataKey="date" stroke={darkMode ? "#fff" : "#000"} />
              <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none" }} />
              <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="#0ea5e9" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </>
  );

  // Cloud Usage view
  const cloudUsageView = (
    <>
      <h2 className="text-2xl font-semibold mb-6">Cloud Usage Overview</h2>
      <GlassCard title="Service Usage" darkMode={darkMode}>
        <div className="space-y-4">
          {(data?.services || []).map((s) => (
            <div key={s.name} className="flex justify-between py-2">
              <span>{s.name}</span>
              <span className="font-semibold text-cyan-400">{s.usage}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );

  // Settings view
  const settingsView = (
    <>
      <h2 className="text-2xl font-semibold mb-6">System Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Account Information" darkMode={darkMode}>
          <div className="space-y-4">
            {Object.entries(data?.account || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-semibold text-cyan-400">{value?.toString()}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Notification Settings" darkMode={darkMode}>
          <div className="space-y-4">
            {Object.entries(data?.notifications || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2">
                <span className="capitalize">{key}</span>
                <span className={`font-semibold ${value ? "text-green-400" : "text-red-400"}`}>
                  {value ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );

  // Users view
  const usersView = (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl border backdrop-blur-lg ${
                darkMode ? "bg-white/10 border-white/20 text-white" : "bg-white border-gray-300 text-black"
              }`}
              style={darkMode ? {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              } : {}}
            >
              <option
                value="all"
                style={darkMode ? {
                  backgroundColor: '#1e293b',
                  color: 'white'
                } : {}}
              >
                All Departments
              </option>
              {departments.map(dept => (
                <option
                  key={dept.id}
                  value={dept.name}
                  style={darkMode ? {
                    backgroundColor: '#1e293b',
                    color: 'white'
                  } : {}}
                >
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition font-medium">
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      <GlassCard title="Users" darkMode={darkMode}>
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-md ${darkMode ? "text-white" : "text-black"}`}>
            <thead>
              <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <th className="text-left p-3 border border-gray-300 dark:border-gray-600">Name</th>
                <th className="text-left p-3 border border-gray-300 dark:border-gray-600">Email</th>
                <th className="text-left p-3 border border-gray-300 dark:border-gray-600">Department</th>
                <th className="text-left p-3 border border-gray-300 dark:border-gray-600">Role</th>
                <th className="text-left p-3 border border-gray-300 dark:border-gray-600">Status</th>
                <th className="text-left p-3 border border-gray-300 dark:border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(user => userFilter === "all" || user.department === userFilter)
                .map((user) => (
                  <tr key={user.id}>
                    <td className="p-3 border border-gray-300 dark:border-gray-600">{user.name}</td>
                    <td className="p-3 border border-gray-300 dark:border-gray-600">{user.email}</td>
                    <td className="p-3 border border-gray-300 dark:border-gray-600">{user.department}</td>
                    <td className="p-3 border border-gray-300 dark:border-gray-600">{user.role}</td>
                    <td className="p-3 border border-gray-300 dark:border-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-300 dark:border-gray-600">
                      <div className="flex gap-2">
                        <button className="p-1 rounded bg-blue-500/20 hover:bg-blue-500/30 transition">
                          <Edit size={14} className="text-blue-400" />
                        </button>
                        <button className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 transition">
                          <XCircle size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GlassCard title="Department Usage" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.departments || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#ffffff22" : "#00000022"} />
              <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
              <YAxis stroke={darkMode ? "#fff" : "#000"} />
              <Tooltip contentStyle={{ background: darkMode ? "#1e293b" : "#fff", border: "none" }} />
              <Bar dataKey="hours" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard title="Department Summary" darkMode={darkMode}>
          <div className="space-y-4">
            {(data?.departments || []).map((dept) => (
              <div key={dept.name} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                <div>
                  <p className="font-medium">{dept.name}</p>
                  <p className="text-sm text-slate-400">{dept.services?.length || 0} services</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-cyan-400">{dept.hours}h/day</p>
                  <p className="text-xs text-slate-400">avg usage</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
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
            🚀 Cloud Cost Intelligence - Admin
          </h1>
          <div className="flex items-center gap-4">
            {(selectedSection === "dashboard" || selectedSection === "cloudUsage") && (
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`px-4 py-2 rounded-xl w-72 border backdrop-blur-lg ${
                  darkMode ? "bg-white/10 border-white/20 text-white" : "bg-white border-gray-300 text-black"
                }`}
              />
            )}
            <button
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>

        {selectedSection === "dashboard" && dashboardView}
        {selectedSection === "analytics" && analyticsView}
        {selectedSection === "cloudUsage" && cloudUsageView}
        {selectedSection === "settings" && settingsView}
        {selectedSection === "users" && usersView}
      </main>
    </div>
  );
};

export default CloudDashboard;