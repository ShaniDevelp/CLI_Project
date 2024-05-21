import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const Chart = ({ data }) => {
  
  const keys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== "Date") : [];
  
  return (
    <div className="chart-container">
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {keys.map((key, index) => (
          <Line key={index} type="monotone" dataKey={key} stroke={`#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')}`} />
        ))}
      </LineChart>
    </div>
  );
};

export default Chart;
