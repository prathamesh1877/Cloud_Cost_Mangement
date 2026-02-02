import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { dashboardApi } from "../services/apiService";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await dashboardApi.getAnalyticsData();
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="text-center py-8">No data available</div>;
  }

  const lineData = data.trendData?.map((item, i) => ({ month: i + 1, value: item.value })) || [];
  const barData = data.usageStats?.map((item, i) => ({ service: item.metric, value: parseFloat(item.value) })) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cloud Analytics</h1>

      <div className="grid grid-cols-2 gap-10">
        <div className="p-6 rounded-xl bg-white/10">
          <h2 className="text-lg mb-3">Monthly Cost Trend</h2>
          <LineChart width={500} height={250} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00eaff" />
          </LineChart>
        </div>

        <div className="p-6 rounded-xl bg-white/10">
          <h2 className="text-lg mb-3">Usage Distribution</h2>
          <BarChart width={500} height={250} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#00eaff" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
