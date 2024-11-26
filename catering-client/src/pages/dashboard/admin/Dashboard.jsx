import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactApexChart from "react-apexcharts";
import IconOrder from "../../../assets/Icon_Order.png";
import IconDeliver from "../../../assets/icon Delivered.png";
import IconCancel from "../../../assets/Icon_Orderx.png";
import IconBag from "../../../assets/Icon_bag.png";

const Dashboard = () => {
  const token = localStorage.getItem("access-token");
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useQuery({
    queryKey: ["salesData"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders/all`, {
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

  const barChartOptions = {
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

  const pieChartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Total Orders", "Customer Growth", "Total Revenue"],
    series: [81, 22, 62], // Example data, replace with actual values
    colors: ["#F87171", "#34D399", "#60A5FA"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      formatter: (val) => `${val}%`,
    },
  };

  return (
    <div className="text-center max-w-screen-xl mx-auto py-6 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Hi, Genard. Welcome back to La Estelita Catering Admin!
          </p>
        </div>
        <div className="relative">
          <button className="bg-white border border-gray-300 text-gray-800 text-sm py-2 px-4 rounded-md shadow-sm flex items-center space-x-2">
            <span className="font-medium">Filter Period</span>
            <svg
              className="w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <p className="text-sm text-gray-500 mt-1">
            17 April 2020 - 21 May 2020
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={IconOrder} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">75</h3>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-xs text-green-500">+4% (30 days)</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={IconDeliver} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">357</h3>
            <p className="text-sm text-gray-500">Total Delivered</p>
            <p className="text-xs text-green-500">+4% (30 days)</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={IconCancel} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">65</h3>
            <p className="text-sm text-gray-500">Total Canceled</p>
            <p className="text-xs text-red-500">+25% (30 days)</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={IconBag} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">$128</h3>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xs text-green-500">+12% (30 days)</p>
          </div>
        </div>
      </div>

      {/* Sales Chart Section */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Monthly Sales</h2>
        </div>
        <ReactApexChart
          options={barChartOptions}
          series={barChartOptions.series}
          type="bar"
          height={500}
          width={900}
        />
      </div>

      {/* Pie Chart Section */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Pie Chart</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="text-sm text-gray-600">Chart</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="text-sm text-gray-600">Show Value</span>
            </label>
          </div>
        </div>
        <ReactApexChart
          options={pieChartOptions}
          series={pieChartOptions.series}
          type="donut"
          height={350}
        />
      </div>
    </div>
  );
};

export default Dashboard;
