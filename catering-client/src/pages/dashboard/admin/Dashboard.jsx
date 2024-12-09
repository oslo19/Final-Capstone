import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactApexChart from "react-apexcharts";
import IconOrder from "../../../assets/Icon_Order.png";
import IconDeliver from "../../../assets/icon Delivered.png";
import IconCancel from "../../../assets/Icon_Orderx.png";
import IconBag from "../../../assets/Icon_bag.png";
import axios from "axios";

const Dashboard = () => {
  const token = localStorage.getItem("access-token");
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));
  const [totalOrders, setTotalOrders] = useState(0); // State for total orders
  const [totalBookings, setTotalBookings] = useState(0); // State for total bookings
  const [totalCanceled, setTotalCanceled] = useState(0); // State for total canceled orders
  const [totalRevenue, setTotalRevenue] = useState(0); // State for total revenue
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch orders data and calculate monthly sales
  useQuery({
    queryKey: ["salesData"],
    queryFn: async () => {
      try {
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
        data.orders.forEach((order) => {
          if (order.createdAt && order.price) {
            const month = new Date(order.createdAt).getMonth();
            monthlySalesData[month] += order.price;
          }
        });
  
        return monthlySalesData; // Make sure to return valid data
      } catch (error) {
        console.error("Error fetching sales data:", error);
        return Array(12).fill(0); // Return default value (empty sales data) in case of error
      }
    },
  });
  

  // Fetch and set totalOrders for source = "cart"
  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/all`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const cartOrders = response.data.orders.filter((order) => order.source === "cart");
        setTotalOrders(cartOrders.length);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    fetchTotalOrders();
  }, [BASE_URL, token]);

  // Fetch and set totalBookings for source = "booking"
  useEffect(() => {
    const fetchTotalBookings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/all`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const bookingOrders = response.data.orders.filter((order) => order.source === "booking");
        setTotalBookings(bookingOrders.length);
      } catch (error) {
        console.error("Error fetching total bookings:", error);
      }
    };

    fetchTotalBookings();
  }, [BASE_URL, token]);

  // Fetch and set totalCanceled for status = "canceled"
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/all`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
  
        const orders = response.data.orders;
  
        // Filter orders by status "canceled"
        const canceledOrders = orders.filter((order) => order.status === "cancelled");
  
        // Filter orders by source "cart"
        const cartOrders = orders.filter((order) => order.source === "cart");
  
        // Filter orders by source "booking"
        const bookingOrders = orders.filter((order) => order.source === "booking");
  
        // Set state for each category
        setTotalCanceled(canceledOrders.length);
        setTotalOrders(cartOrders.length);
        setTotalBookings(bookingOrders.length);
  
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, [BASE_URL, token]);
  

  // Fetch and calculate totalRevenue by summing the price of all completed orders
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/all`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const completedOrders = response.data.orders.filter((order) => order.status !== "canceled");
        const revenue = completedOrders.reduce((acc, order) => acc + order.price, 0);

        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    fetchTotalRevenue();
  }, [BASE_URL, token]);

  // Calculate percentages for pie chart (without including Total Revenue)
  const totalOrdersBookingsCanceled = totalOrders + totalBookings + totalCanceled;
  const ordersPercentage = (totalOrders / totalOrdersBookingsCanceled) * 100;
  const bookingsPercentage = (totalBookings / totalOrdersBookingsCanceled) * 100;
  const canceledPercentage = (totalCanceled / totalOrdersBookingsCanceled) * 100;

  const pieChartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Total Orders", "Total Bookings", "Total Canceled"],
    series: [ordersPercentage, bookingsPercentage, canceledPercentage],
    colors: ["#F87171", "#34D399", "#60A5FA"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      formatter: (val) => `${Math.round(val)}%`,
    },
  };

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

  return (
    <div className="text-center max-w-screen-xl mx-auto py-6 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Hi, Genard. Welcome back to La Estelita Catering Admin!
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
            <h3 className="text-2xl font-bold text-gray-800">{totalOrders}</h3>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={IconDeliver} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{totalBookings}</h3>
            <p className="text-sm text-gray-500">Total Bookings</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={IconCancel} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{totalCanceled}</h3>
            <p className="text-sm text-gray-500">Total Canceled</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={IconBag} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">₱{totalRevenue}</h3>
            <p className="text-sm text-gray-500">Total Revenue</p>
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
          height={350}
        />
      </div>

      {/* Pie Chart Section */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Orders/Bookings</h2>
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
