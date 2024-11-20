import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactApexChart from "react-apexcharts";

const Dashboard = () => {
  const token = localStorage.getItem("access-token");
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));

  useQuery({
    queryKey: ["salesData"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:6001/orders/all`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();

      const monthlySalesData = Array(12).fill(0);
      data.forEach((order) => {
        if (order.createdAt && order.price) {
          const month = new Date(order.createdAt).getMonth();
          monthlySalesData[month] += order.price;
        }
      });

      setMonthlySales(monthlySalesData);
    },
  });

  const chartOptions = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: { show: false },
    },
    series: [
      {
        name: "Sales",
        data: monthlySales,
      },
    ],
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    yaxis: {
      labels: {
        formatter: (value) => `₱${value >= 1000 ? `${value / 1000}k` : value}`,
      },
    },
  };

  return (
    <div className="text-center max-w-screen-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sales Dashboard</h1>
      <ReactApexChart options={chartOptions} series={chartOptions.series} type="bar" height={500} width={900} />
    </div>
  );
};

export default Dashboard;
