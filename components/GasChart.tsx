import React from "react";

interface GasChartProps {
  gasData: number[]; // Array of gas values in raw numbers
}

export default function GasChart({ gasData }: GasChartProps) {
  if (gasData.length === 0) return null;

  const maxGas = Math.max(...gasData);
  const minGas = Math.min(...gasData);
  const range = maxGas - minGas || 1; // Avoid division by zero

  return (
    <div className="flex items-end gap-1 h-16">
      {gasData.map((gas, index) => {
        const heightPercent = ((gas - minGas) / range) * 100;
        const height = Math.max(heightPercent, 5); // Minimum 5% height for visibility

        return (
          <div
            key={index}
            className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-300 hover:from-blue-400 hover:to-blue-200"
            style={{ height: `${height}%` }}
            title={`${(gas / 1e6).toFixed(2)}M gas`}
          />
        );
      })}
    </div>
  );
}
