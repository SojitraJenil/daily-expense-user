import { userGraphExpense } from "atom/atom";
import { useAtom } from "jotai";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Series A", value: 10 },
  { name: "Series B", value: 15 },
  { name: "Series C", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
        <p className="text-gray-800">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

function Graph() {
  const [userGraphExpenseData] = useAtom(userGraphExpense);
  console.log("userGraphExpenseData", userGraphExpenseData);

  return (
    <div className="pt-5 pb-3 bg-white rounded-lg shadow-lg">
      <h2 className="mt-2 align-middle mx-auto text-center text-xl font-semibold text-gray-700 mb-4">
        Pie Chart Example
      </h2>
      <div className="w-full h-64 md:h-96">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={
                <CustomTooltip
                  active={undefined}
                  payload={undefined}
                  label={undefined}
                />
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Graph;
