import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Map from "../../components/Map";
import dayjs from "dayjs"; // For date formatting
import { TbLetterL } from "react-icons/tb";
import { PiCookingPotFill } from "react-icons/pi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthProvider";
import useUsers from "../../hooks/useUser";

const OrderTracking = () => {
  const { transactionId } = useParams();
  const [orderStatus, setOrderStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [expectedArrival, setExpectedArrival] = useState("");
  const [orderStart, setOrderStart] = useState("");
  const [orderId, setOrderId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [preparationCountdown, setPreparationCountdown] = useState("");
  const [deliveryCountdown, setDeliveryCountdown] = useState("");
  const [isDeliveryPhase, setIsDeliveryPhase] = useState(false);
  const [estimatedMilestones, setEstimatedMilestones] = useState(null);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(AuthContext);
  const { users } = useUsers();

  const currentUser = users.find((u) => u.email === user.email);

  const updateCountdown = (endTime, setCountdownState, callback) => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const timeLeft = dayjs(endTime).diff(now);

      if (timeLeft <= 0) {
        setCountdownState("00:00:00"); // Timer ends
        if (callback) callback();
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      setCountdownState(formattedTime);
    };

    calculateTimeLeft();

    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval
  };

  const updateProgress = () => {
    const now = new Date();
    let newProgress = 0;

    if (!estimatedMilestones) {
      newProgress = 0;
    } else if (now >= new Date(estimatedMilestones.delivered)) {
      newProgress = 100; // Delivered
    } else if (now >= new Date(estimatedMilestones.outForDelivery)) {
      newProgress = 75; // Out for Delivery
    } else if (now >= new Date(estimatedMilestones.shipped)) {
      newProgress = 50; // Shipped
    } else if (now >= new Date(estimatedMilestones.confirmed)) {
      newProgress = 25; // Confirmed
    }

    if (newProgress !== progress) {
      setProgress(newProgress); // Update only if progress has changed
    }
  };

  const cancelOrder = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel the order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });
  
    if (result.isConfirmed) {
      try {
        // Step 1: Fetch the order by transactionId to get the _id
        const orderResponse = await axios.get(`${BASE_URL}/orders/${transactionId}`);
        const order = orderResponse.data;
  
        if (!order._id) {
          Swal.fire("Error!", "Order not found.", "error");
          return;
        }
  
        // Step 2: Update the order's status to "cancelled" using PUT
        const updatedOrder = { ...order, status: "cancelled" }; // Preserve other fields
        const response = await fetch(`${BASE_URL}/orders/${order._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder),
        });
  
        if (!response.ok) throw new Error(await response.text());
  
        Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
        setOrderStatus("cancelled");
        setProgress(0);
      } catch (error) {
        console.error("Error cancelling order:", error);
        Swal.fire("Error!", "Failed to cancel the order. Please try again.", "error");
      }
    }
  };
  
  

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/${transactionId}`);
        const order = response.data;

        setOrderStatus(order.status);
        setOrderId(order._id);
        setCreatedAt(order.createdAt);
        setEstimatedMilestones(order.estimatedMilestones);

        if (order.status === "confirmed") {
          const userScheduledTime = dayjs(order.schedule);
          const preparationEndTime = userScheduledTime.subtract(30, "minute");
          const startTime = preparationEndTime.subtract(15, "minute");

          setOrderStart(startTime.format("MMMM D, YYYY h:mm A"));
          setExpectedArrival(userScheduledTime.format("MMMM D, YYYY h:mm A"));

          if (currentUser && currentUser.coordinates) {
            setCurrentLocation(currentUser.coordinates);
          }

          const stopPreparationCountdown = updateCountdown(
            preparationEndTime,
            setPreparationCountdown,
            () => {
              setIsDeliveryPhase(true);
              setProgress(75);

              const stopDeliveryCountdown = updateCountdown(
                userScheduledTime,
                setDeliveryCountdown,
                () => setProgress(100)
              );

              return () => stopDeliveryCountdown();
            }
          );

          return () => stopPreparationCountdown();
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    if (transactionId) {
      fetchOrderStatus();
    }
  }, [transactionId, currentUser]);

  useEffect(() => {
    const interval = setInterval(updateProgress, 5000);

    return () => clearInterval(interval);
  }, [estimatedMilestones]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-800">
      <div className="container mx-auto p-5">
        <div className="bg-white shadow-lg border border-gray-800 rounded-lg p-5 my-5">
          <div className="flex flex-col md:flex-row justify-between items-center mx-5 my-3">
            <div className="text-center">
              <p className="text-3xl text-prime font-bold mb-3">
                La Estellita Catering
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-lg text-gray-900">
                <i className="text-blue-500 fas fa-cart-shopping mr-2"></i>
                Order ID:{" "}
                <span className="text-prime font-bold">
                  {orderId || "Loading..."}
                </span>
              </p>
            </div>
          </div>

          {orderStatus === "cancelled" ? (
            <div className="text-center p-5">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Your Order Has Been Cancelled
              </h2>
              <p className="text-lg text-gray-700">
                We’re sorry for the inconvenience. If you have any questions,
                please contact support.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col text-right text-lg">
                <p className="font-mono font-bold mb-2">
                  Date Schedule:{" "}
                  <span className="text-black border border-gray-500 font-bold px-3 py-2 rounded shadow">
                    {expectedArrival || "Calculating..."}
                  </span>
                </p>
                <p className="font-mono font-bold my-2">
                  {orderStatus === "order pending"
                    ? "Thank you for your order! Please wait for confirmation."
                    : isDeliveryPhase
                    ? "Arriving by:"
                    : "Preparation Time:"}
                  <span className="bg-transparent text-black border border-gray-500 font-bold px-3 py-2 rounded shadow">
                    {orderStatus === "order pending"
                      ? "Waiting..."
                      : isDeliveryPhase
                      ? deliveryCountdown
                      : preparationCountdown || "Waiting..."}
                  </span>
                </p>
              </div>
              <div className="container-fluid">
                <div className="flex items-center justify-around p-4">
                  <button
                    className={`${
                      progress >= 25 ? "bg-transparent" : "bg-gray-400"
                    } rounded-full p-4 flex justify-center items-center`}
                    title="Order Confirmed"
                  >
                    <TbLetterL className="text-2xl text-prime" />
                  </button>
                  <span
                    className={`${
                      progress >= 50 ? "bg-prime" : "bg-gray-400"
                    } h-1 w-1/2`}
                  ></span>
                  <button
                    className={`${
                      progress >= 50 ? "bg-transparent" : "bg-gray-400"
                    }  rounded-full p-4`}
                    title="Order Shipped"
                  >
                    <PiCookingPotFill className="text-prime text-2xl" />
                  </button>
                  <span
                    className={`${
                      progress >= 50 ? "bg-prime" : "bg-gray-400"
                    } h-1 w-1/2`}
                  ></span>
                  <button
                    className={`${
                      progress >= 75 ? "bg-transparent" : "bg-gray-400"
                    } rounded-full p-4`}
                    title="Out for delivery"
                  >
                    <MdOutlineDeliveryDining className="text-2xl text-prime" />
                  </button>
                  <span
                    className={`${
                      progress === 100 ? "bg-prime" : "bg-gray-400"
                    } h-1 w-1/2`}
                  ></span>
                  <button
                    className={`${
                      progress === 100 ? "bg-transparent" : "bg-gray-400"
                    } rounded-full p-4`}
                    title="Order Delivered"
                  >
                    <FaHome className="text-2xl text-prime" />
                  </button>
                </div>
              </div>
              {currentLocation && (
                <div className="my-6">
                  <h2 className="text-xl font-bold mb-3">Current Location</h2>
                  <Map />
                </div>
              )}
              <div className="flex justify-end my-4">
                <button
                  onClick={cancelOrder}
                  className="bg-red-500 text-prime px-5 py-2 rounded shadow hover:bg-red-700 font-semibold"
                >
                  Cancel Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
