import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface PlotProps {
  data: Array<{ x: number; y: number }>;
  width?: number;
  height?: number;
}

export const Plot: React.FC<PlotProps> = ({ data, width = 500, height = 300 }) => {
  return (
    <LineChart width={width} height={height} data={data}>
      <Line type="monotone" dataKey="y" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="x" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};
