import React from "react";

const SettingsPage = ({ data }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{data.title}</h1>

      <div className="space-y-4">
        {data.options.map((opt) => (
          <div 
            key={opt.key} 
            className="p-4 bg-white/10 rounded-xl flex justify-between items-center"
          >
            <span className="text-lg">{opt.label}</span>
            <span className="opacity-80">{opt.value ? "Enabled" : "Disabled"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
