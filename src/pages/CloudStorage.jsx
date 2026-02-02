import React, { useEffect, useState } from "react";
import { dashboardApi } from "../services/apiService";

const CloudStorage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await dashboardApi.getCloudUsageData();
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading storage data...</div>;
  }

  if (!data) {
    return <div className="text-center py-8">No storage data available</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cloud Storage</h1>

      <div className="grid grid-cols-3 gap-6">
        {data.services?.map((service, index) => (
          <div key={index} className="p-6 bg-white/10 rounded-xl">
            <h2 className="text-lg font-semibold">{service.name}</h2>
            <p>Usage: {service.usage}</p>
            <p>Status: Active</p>
          </div>
        )) || []}
      </div>
    </div>
  );
};

export default CloudStorage;
