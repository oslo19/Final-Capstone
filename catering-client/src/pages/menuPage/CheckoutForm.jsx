import React, { useContext, useState, useEffect } from "react";
import Map from "../../components/Map";
import MapSearchBox from "../../components/MapSearchBox";
import { AuthContext } from "../../contexts/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { SlLocationPin } from "react-icons/sl";
import "react-datepicker/dist/react-datepicker.css";
import useCart from "../../hooks/useCart";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs from "dayjs";
import MobileNumberModal from "../../components/MobileNumberModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import useUsers from "../../hooks/useUser";
import { RiCoupon2Line } from "react-icons/ri";
import VoucherModal from "../../components/VoucherModal";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import paypal from "../../assets/paypal.png";
import { v4 as uuidv4 } from "uuid";


const defaultCoordinates = [10.239613, 123.780381];
const CheckoutForm = () => {
  const { users, refetch } = useUsers();
  const location = useLocation();

  const axiosSecure = useAxiosSecure();
  const { user, sendOtp } = useContext(AuthContext); // Get user from context
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState(""); // Store full address as a string
  const [modal, setModal] = useState(null); // State to store modal reference
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [scheduledText, setScheduledText] = useState("Select a date and time");
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // New state to control edit mode
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [cart] = useCart();
  const [isMobileNumberModalVisible, setIsMobileNumberModalVisible] =
    useState(false);
  const [otpRecord, setOtpRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileError, setMobileError] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isMobileEditing, setIsMobileEditing] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [voucher, setVoucher] = useState([]);
  const [voucherList, setVoucherList] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false); // Tracks payment success
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [hasMobileNumber, setHasMobileNumber] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  console.log("Location State:", location.state);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  console.log();
  const {
    menuItems = [],
    rentalItems = [],
    venueItems = [],
    cartItems = [],  
    orderTotal = 0,
    source,
    typeOfEvent,
    numberOfPax,
    typeOfMenu,

  } = location.state || {}; // Destructure the state values



  const [paymentAmount, setPaymentAmount] = useState(orderTotal);
  useEffect(() => {
    if (selectedPaymentMethod === "Paypal") {
      const container = document.getElementById("paypal-button-container");

      if (container && !container.hasChildNodes()) {
        window.paypal
          .Buttons({
            // Creates the PayPal order
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: orderTotal.toFixed(2),
                    },
                  },
                ],
              });
            },
            // Called when the PayPal payment is approved
            onApprove: async (data, actions) => {
              try {
                // Capture the payment details
                const details = await actions.order.capture();
                console.log("Payment Details:", details);

                // Extract the transaction ID from PayPal response
                const transactionId = details.id; // PayPal transaction ID
                console.log("PayPal Transaction ID:", transactionId);

                // Update the state with the PayPal transaction ID
                setTransactionId(transactionId);
                setIsPaymentComplete(true);

                if (container) {
                  container.innerHTML = `
                    <div class="text-green-600 font-bold">
                      Payment Successful! Transaction ID: ${transactionId}
                    </div>
                  `;
                }

                Swal.fire(
                  "Payment Successful",
                  "Your payment has been processed successfully. Please click 'Place Order' to finalize your order.",
                  "success"
                );
              } catch (error) {
                console.error("Error during PayPal approval:", error);

                Swal.fire(
                  "Error",
                  "Something went wrong during the payment process. Please try again.",
                  "error"
                );
              }
            },
            // Handles errors during the PayPal payment process
            onError: (err) => {
              console.error("PayPal Payment Error:", err);
              Swal.fire("Error", "Payment failed. Please try again.", "error");
            },
          })
          .render("#paypal-button-container");
      }
    }

    // Cleanup to avoid duplicate PayPal buttons
    return () => {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [selectedPaymentMethod, orderTotal]);

  {
    /*ORDER SUMMARY */
  }
  const deliveryFee = 100;
  const currentUser = users.find((u) => u.email === user.email);

  // Calculate the cart subtotal
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const subtotal = source === "booking" ? orderTotal : cartSubtotal;
    setFinalTotal(subtotal - discount + deliveryFee);
  }, [source, orderTotal, cartSubtotal, discount, deliveryFee]);

  {
    /*User logic */
  }
  useEffect(() => {
    if (user) {
      if (user.displayName) {
        const names = user.displayName.split(" ");
        const first = names.slice(0, 2).join(" ");
        const last = names[names.length - 1];
        setFirstName(first || "");
        setLastName(last || "");
      }
  
      // Check if currentUser has mobile number and set the state accordingly
      if (currentUser) {
        if (currentUser.mobileNumber) {
          setMobileNumber(currentUser.mobileNumber);
          setHasMobileNumber(true); // User has a mobile number
        } else {
          setHasMobileNumber(false); // User doesn't have a mobile number
        }
      }
    }
  }, [user, currentUser]);
  

  {
    /*User END */
  }

  {
    /*For Address Logic */
  }

  useEffect(() => {
    if (currentUser) {
      const userCoordinates = currentUser.coordinates;
      const userAddress = currentUser.address;

      if (Array.isArray(userCoordinates) && userCoordinates.length === 2) {
        setCoordinates(userCoordinates);
      } else {
        setCoordinates(defaultCoordinates); // Use fallback if coordinates are missing
      }

      setAddress(userAddress || "No address available");
    }
  }, [currentUser]);
  const handleAddressSelect = (placeDetails) => {
    const { lat, lon, display_name } = placeDetails;

    if (lat && lon) {
      setAddress(display_name);
      setCoordinates([parseFloat(lat), parseFloat(lon)]);
    } else {
      Swal.fire("Error", "Invalid place details selected.", "error");
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosSecure.patch(
        `/users/${currentUser._id}/address`,
        {
          address: address,
          coordinates: coordinates,
        }
      );

      if (response.status === 200) {
        refetch(); // Fetch updated user data
        Swal.fire("Success", "Address updated successfully", "success");

        // Close the modal
        const modal = document.getElementById("my_modal_address");
        if (modal) {
          modal.close();
        }
      } else {
        throw new Error("Failed to update address");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleShowModal = () => {
    const modal = document.getElementById("my_modal_address");
    if (modal) {
      modal.showModal(); // Show the modal using `showModal`
    } else {
      console.error("Modal element with ID 'my_modal_address' not found.");
    }
  };

  {
    /*Address Logic END*/
  }

  {
    /*Delivery Option Logic */
  }
  useEffect(() => {
    if (source !== "booking") {
      const minTime = dayjs().add(30, "minute"); // Set the next available time
      setSelectedDateTime(minTime);
      setScheduledText(minTime.format("MMMM D, YYYY h:mm A"));
    }
  }, [source]);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const handleConfirm = async () => {
    const now = dayjs(); // Current time
    const minTime = now.add(45, "minute"); // Minimum time is 45 minutes from now

    // Ensure the selected time is valid (at least 45 minutes from now)
    if (!selectedDateTime || selectedDateTime.isBefore(minTime)) {
      const suggestedTime = minTime;
      setSelectedDateTime(suggestedTime); // Update to the next available time
      setScheduledText(suggestedTime.format("MMMM D, YYYY h:mm A"));

      Swal.fire(
        "Invalid Schedule",
        `We’ve automatically set the next available time: ${suggestedTime.format(
          "MMMM D, YYYY h:mm A"
        )}.`,
        "info"
      );
      return;
    }

    const selectedDate = selectedDateTime.format("YYYY-MM-DD");

    if (unavailableDates.includes(selectedDate)) {
      Swal.fire(
        "Error",
        "The selected schedule is unavailable. Please choose another date.",
        "error"
      );
      return;
    }

    setScheduledText(selectedDateTime.format("MMMM D, YYYY h:mm A"));
    closeModal();
  };

  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      try {
        // Fetch only confirmed orders from the backend
        const response = await axios.get(`${BASE_URL}/orders/confirmed`);  
        
        // Set the confirmed orders in the state
        const confirmedOrders = response.data;
  
        console.log("Confirmed orders fetched:", confirmedOrders); // Debug: Log the confirmed orders
  
        // Create a map to store count of each schedule date
        const scheduleDateCount = {};
  
        // Iterate through the orders to count occurrences of each schedule date
        confirmedOrders.forEach(order => {
          const formattedDate = new Date(order.schedule).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit'
          }).replace('/', '-'); // Change '/' to '-' for "MM-DD" format
  
          // Increment the count for this date
          if (scheduleDateCount[formattedDate]) {
            scheduleDateCount[formattedDate] += 1;
          } else {
            scheduleDateCount[formattedDate] = 1;
          }
        });
  
        // Now, filter the dates that appear 3 or more times
        const unavailableDatesSet = new Set();
        Object.keys(scheduleDateCount).forEach(date => {
          if (scheduleDateCount[date] >= 3) {
            unavailableDatesSet.add(date); // Only add dates that appear 3 or more times
            console.log(`Date ${date} has ${scheduleDateCount[date]} occurrences`);
          }
        });
  
        // Convert the Set back to an array and update the state
        setUnavailableDates(Array.from(unavailableDatesSet));
  
      } catch (error) {
        console.error("Error fetching confirmed orders:", error);
        Swal.fire("Error", "Failed to fetch confirmed orders.", "error");
      }
    };
  
    fetchConfirmedOrders();
  }, []); // This runs once when the component mounts
  
  
  
  
  
  
  console.log(unavailableDates)



  const handleStandardDelivery = () => {
    const now = dayjs(); // Current time
    const scheduledTime = now.add(45, "minute"); // Add 45 minutes to the current time

    setSelectedDeliveryOption("Standard"); // Mark as "Standard" delivery
    setSelectedDateTime(scheduledTime); // Update the delivery time
    setScheduledText(scheduledTime.format("MMMM D, YYYY h:mm A")); // Format the schedule text
  };

  {
    /*Delivery END LOGIC */
  }

  {
    /* Mobile Logic or Personal Details */
  }

  
  
  
  const isValidMobileNumber = (value) => {
    const numberWithoutCountryCode = value.replace(/^\+63/, ""); // Remove +63 prefix if present
    return /^\d{9,12}$/.test(numberWithoutCountryCode); // Validate the remaining digits (9 to 12)
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);

    // Check validity and set error message
    if (isValidMobileNumber(value)) {
      setMobileError(null);
    } else {
      setMobileError(
        "Invalid mobile number. Please enter a valid phone number."
      );
    }

    // Enable the Save button if valid, else disable it
    setIsSaveEnabled(isValidMobileNumber(value));
  };

  

  const handleSubmitMobileNumber = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formattedNumber = `+63${
      mobileNumber.startsWith("0") ? mobileNumber.slice(1) : mobileNumber
    }`;
  
    try {
      const checkNumberResponse = await axiosSecure.get(`/users/check-mobile/${formattedNumber}`);
    
      if (checkNumberResponse.data.exists) {
      
        Swal.fire({
          title: "Error",
          text: "This mobile number is already registered.",
          icon: "error",
          confirmButtonText: "Okay"
        });
        setIsSubmitting(false);
        return;
      } else {
        const otpResponse = await axiosSecure.post("/otp/send-code", {
          phone_number: formattedNumber,
        });
    
        if (otpResponse.status === 200) {
          console.log("OTP sent successfully:", otpResponse.data);
          console.log("OTP Record from Backend:", otpResponse.data.otpRecord);
    
          // Store the OTP record in the state
          setOtpRecord(otpResponse.data.otpRecord);
    
          await axiosSecure.patch(`/users/${currentUser._id}/mobileNumber`, {
            phone_number: formattedNumber,
          });
    
          const updatedUserResponse = await axiosSecure.get(
            `/users/${currentUser._id}/mobileNumber`
          );
          
          // Update mobile number state after getting the response
          const updatedMobileNumber = updatedUserResponse.data.mobileNumber;
          setMobileNumber(updatedMobileNumber); // Update state with the new number
    
      
    

          setTimeout(() => {
            setIsSubmitting(false);
            setIsMobileNumberModalVisible(true); 
          }, 2000); 
        } else {
          throw new Error(otpResponse.data.message || "Failed to send OTP");
        }
      }
      
      
    } catch (error) {
      Swal.fire("An OTP has already been sent. Please wait for it to expire before requesting a new one.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleCloseMobileModal = () => {
    setIsMobileNumberModalVisible(false);
  };
  const handlePaymentChange = (method) => {
    setSelectedPaymentMethod(method);

    // Generate a transaction ID for the selected payment method
    const newTransactionId = uuidv4();
    setTransactionId(newTransactionId);

    console.log("Generated Transaction ID:", newTransactionId);
  };
  

  useEffect(() => {
    console.log("Updated mobile number:", mobileNumber);  // Debugging line
  }, [mobileNumber]);
  
  const handleEditClick = () => setIsMobileEditing(!isMobileEditing);
  {
    /* Mobile Logic or Personal Details LOGIC END*/
  }

  {
    /*Voucher Logic */
  }
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/voucher`);
        setVoucherList(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, []);

  const handleApplyVoucher = (voucher) => {
    let discountAmount = 0;

    if (voucher.discountType === "percentage") {
      discountAmount =
        ((source === "booking" ? orderTotal : cartSubtotal) *
          voucher.discountValue) /
        100;
    } else if (voucher.discountType === "flat") {
      discountAmount = voucher.discountValue;
    }

    // Ensure the discount does not exceed the subtotal
    const subtotal = source === "booking" ? orderTotal : cartSubtotal;
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    setDiscount(discountAmount);

    Swal.fire({
      title: "Voucher Applied",
      text: `You applied ${voucher.code} - ${voucher.discountValue}% Off`,
      icon: "success",
    });
  };

  //HANDLE PAYMENT PLACEORDER BUTTON
  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (!isAgreementChecked) {
      Swal.fire(
        "Error",
        "You must agree to the terms and conditions.",
        "error"
      );
      return;
    }

    if (!selectedDeliveryOption) {
      Swal.fire("Error", "Please select a delivery option.", "error");
      return;
    }

    if (source === "booking" && scheduledText === "Select a date and time") {
      Swal.fire(
        "Error",
        "Please select a date and time for your event.",
        "error"
      );
      return;
    }

    if (!currentUser?.address) {
      Swal.fire("Error", "Please provide a delivery address.", "error");
      return;
    }

    if (!mobileNumber || !isValidMobileNumber(mobileNumber)) {
      Swal.fire("Error", "Please provide a valid mobile number.", "error");
      return;
    }

    if (!selectedPaymentMethod) {
      Swal.fire("Error", "Please select a payment method.", "error");
      return;
    }

    if (selectedPaymentMethod === "Paypal" && !isPaymentComplete) {
      Swal.fire(
        "Error",
        "Please complete your PayPal payment before placing the order.",
        "error"
      );
      return;
    }
    console.log(currentUser)
    refetch(); 
   

    setIsProcessing(true);

    try {
      let generatedTransactionId = transactionId;

      // Handle PayPal-specific payment validation
      if (selectedPaymentMethod === "Paypal") {
        generatedTransactionId = transactionId;
      }

      // Generate a transaction ID for GCash
      if (selectedPaymentMethod === "GCash") {
        generatedTransactionId = uuidv4();
      }

      const paymentType =
        source === "booking" && paymentAmount < orderTotal ? "partial" : "full";

      const orderData = {
        email: user.email,
        transactionId: generatedTransactionId,
        firstName,
        lastName,
        price: paymentAmount,
        remainingBalance: source === "booking" ? orderTotal - paymentAmount : 0,
        paymentType,
        status: "order pending",
        source: source || "cart",
        items: {
          menuItems,
          rentalItems,
          venueItems,
        },
        cartItems,
        typeOfEvent,
        numberOfPax,
        typeOfMenu,
        address,
        mobileNumber,
        schedule: scheduledText,
        modeOfPayment: selectedPaymentMethod,
      };

      console.log("Order Data being sent:", orderData);

      const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error Response:", errorData);
        throw new Error(errorData.message || "Failed to save the order.");
      }
      const result = await response.json();
      await clearCart();
      Swal.fire(
        "Success",
        "Your order has been placed successfully!",
        "success"
      );
      if (source === "booking") {
        navigate(`/order/${result.order.transactionId}`); // Navigate to booking orders
      } else {
        navigate(`/order-tracking/${result.order.transactionId}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };


  useEffect(() => {
    if (source !== "booking") {
      setPaymentAmount(orderTotal); // Force full payment for cart orders
    }
  }, [source, orderTotal]);

  const clearCart = async () => {
    try {
      if (source === "booking") {
        // Clear booking-specific items
        if (menuItems.length > 0) {
          for (const item of menuItems) {
            await fetch(`${BASE_URL}/booking-cart/${item._id}`, {
              method: "DELETE",
            });
          }
        }
        if (rentalItems.length > 0) {
          for (const item of rentalItems) {
            await fetch(`${BASE_URL}/booking-rental-cart/${item._id}`, {
              method: "DELETE",
            });
          }
        }
        if (venueItems.length > 0) {
          for (const item of venueItems) {
            await fetch(`${BASE_URL}/booking-venue-cart/${item._id}`, {
              method: "DELETE",
            });
          }
        }

        Swal.fire("Success", "Booking cart cleared successfully.", "success");
      } else {
        // Clear general cart items
        if (cart.length > 0) {
          for (const item of cart) {
            await fetch(`${BASE_URL}/carts/${item._id}`, { method: "DELETE" });
          }
        }

        Swal.fire("Success", "Cart cleared successfully.", "success");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      Swal.fire(
        "Error",
        "Failed to clear the cart. Please try again.",
        "error"
      );
    }
  };

  //UPLOAD FILE

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      Swal.fire("Error", "Please select a file to upload.", "error");
      return;
    }

    if (file.type !== "application/pdf") {
      Swal.fire("Error", "Only PDF files are allowed.", "error");
      return;
    }

    if (!currentUser || !currentUser._id) {
      Swal.fire("Error", "You must be logged in to upload a file.", "error");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", currentUser._id);

    try {
      const response = await fetch(`${BASE_URL}/contracts/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire("Success", "File uploaded successfully!", "success");
        setUploadedFiles((prev) => [...prev, result.contract]);
      } else {
        const error = await response.json();
        Swal.fire("Error", error.message, "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row-reverse lg:items-start lg:justify-between gap-6">
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
              <h1 className="font-bold text-2xl mb-4">Order Summary</h1>

              {/* Display Type of Event, Number of Pax, and Type of Menu only for bookings */}
              {source === "booking" && (
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Type of Event:</p>
                    <p className="font-bold text-black">
                      {typeOfEvent
                        ? typeOfEvent.charAt(0).toUpperCase() +
                          typeOfEvent.slice(1)
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Number of Pax:</p>
                    <p className="font-bold text-black">
                      {numberOfPax || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Type of Menu:</p>
                    <p className="font-bold text-black">
                      {typeOfMenu || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {/* Check if the source is "booking" */}
              <div className="space-y-4">
                {source === "booking" ? (
                  <>
                    {/* Booking Menu Items */}
                    {menuItems.length > 0 && (
                      <>
                        <h2 className="text-lg font-semibold mt-4">
                          Menu Items
                        </h2>
                        {menuItems.map((item, index) => (
                          <div
                            key={`menu-${index}`}
                            className="flex justify-between mb-2 mt-2 font-medium text-sm text-gray-500"
                          >
                            <p>
                              {item.quantity} x {item.name}
                            </p>
                            <p className="font-normal text-black">
                              ₱ {item.price * item.quantity}
                            </p>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Booking Amenities */}
                    {rentalItems.length > 0 && (
                      <>
                        <h2 className="text-lg font-semibold mt-4">
                          Amenities
                        </h2>
                        {rentalItems.map((item, index) => (
                          <div
                            key={`amenity-${index}`}
                            className="flex justify-between mb-2 mt-2 font-medium text-sm text-gray-500"
                          >
                            <p>
                              {item.quantity} x {item.name}
                            </p>
                            <p className="font-normal text-black">
                              ₱ {item.price * item.quantity}
                            </p>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Booking Venue */}
                    {venueItems.length > 0 && (
                      <>
                        <h2 className="text-lg font-semibold mt-4">Venue</h2>
                        {venueItems.map((item, index) => (
                          <div
                            key={`venue-${index}`}
                            className="flex justify-between mb-2 mt-2 font-medium text-sm text-gray-500"
                          >
                            <p>{item.venueName}</p>
                            <p className="font-normal text-black">
                              ₱ {item.rentalPrice}
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Render "Order" items if source is not "booking" */}
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between mb-2 mt-5 font-medium text-sm text-gray-500"
                      >
                        <p>
                          {item.quantity} x {item.name}
                        </p>
                        <p className="font-normal text-black">
                          ₱ {item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="divider my-4"></div>

              {/* Subtotal */}
              <div className="flex justify-between text-md text-gray-500">
                <p>Subtotal</p>
                <p className="font-bold text-black">
                  ₱{" "}
                  {source === "booking"
                    ? orderTotal.toFixed(2)
                    : cartSubtotal.toFixed(2)}
                </p>
              </div>

              {/* Discount */}
              {discount > 0 && (
                <div className="flex justify-between text-md text-gray-500 mt-3">
                  <p>Discount</p>
                  <p className="font-bold text-green-600">
                    -₱ {discount.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Delivery Fee */}
              <div className="flex justify-between text-md text-gray-500 mt-3">
                <p>Scheduled delivery</p>
                <p className="font-bold text-black">
                  ₱ {deliveryFee.toFixed(2)}
                </p>
              </div>

              {/* Total */}
              <div className="flex justify-between text-xl font-bold mt-6">
                <p>Total</p>
                <p>₱ {finalTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="w-full lg:w-2/3">
            {/* Delivery Address */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
              <form className="space-y-6" onSubmit={handleSubmitAddress}>
                <div className="flex items-start">
                  <label className="ms-2 text-2xl font-bold text-gray-900">
                    Delivery address
                  </label>
                  {currentUser?.address && (
                    <button
                      type="button"
                      className="ms-auto text-sm text-gray-900 hover:bg-gray-200 px-4"
                      onClick={handleShowModal}
                    >
                      Change
                    </button>
                  )}
                </div>

                {/* Display the current address */}
                {currentUser?.address ? (
                  <>
                    <div className="flex font-bold gap-1">
                      <SlLocationPin className="text-black h-5 w-auto" />
                      <p className="text-sm text-gray-500">
                        {currentUser.address}
                      </p>
                    </div>
                    <div className="relative bg-inherit mt-4">
                      <textarea
                        id="deliveryNote"
                        rows="4"
                        className="peer text-xs bg-transparent h-32 w-full rounded-lg text-black placeholder:text-xs placeholder-transparent ring-2 px-2 ring-gray-400 focus:ring-black focus:outline-none focus:border-black"
                        placeholder="Write something..."
                      ></textarea>
                      <label
                        htmlFor="deliveryNote"
                        className="absolute start-2 text-xs cursor-text left-1 -top-2.5 text-gray-400 bg-gray-50 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-black peer-focus:text-xs transition-all"
                      >
                        Note to delivery - e.g. building, landmark
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">
                      No address available
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleShowModal();
                      }}
                      className="btn"
                    >
                      Add address
                    </button>
                  </>
                )}
              </form>

              {/* Modal for address input */}
              <dialog id="my_modal_address" className="modal modal-middle">
                <div className="modal-box max-w-2xl w-full">
                  <h3 className="font-bold text-lg text-black flex gap-2">
                    What&#39;s your exact location?
                  </h3>
                  <p className="text-sm text-black">
                    Providing your location enables more accurate search and
                    delivery ETA, seamless order tracking, and personalized
                    recommendations.
                  </p>

                  {/* Location input */}
                  <div>
                    <MapSearchBox
                      onAddressSelect={handleAddressSelect}
                      currentAddress={currentUser?.address || ""}
                    />
                  </div>
                  <div className="my-5">
                    <Map center={coordinates} />
                  </div>

                  {/* Submit button for modal */}
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      className="btn bg-black text-white"
                      onClick={handleSubmitAddress}
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("my_modal_address").close()
                    }
                  >
                    Close
                  </button>
                </form>
              </dialog>
            </div>

            {/* Delivery Option */}
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              {/* Heading changes based on source */}
              <h1 className="font-bold text-2xl text-black">
                {source === "booking" ? "Event Schedule" : "Delivery options"}
              </h1>

              {/* Conditional rendering: Show only Scheduled option for 'booking' */}
              {source !== "booking" && (
                <div className="flex items-center ps-4 border-2 border-gray-200 rounded-lg mt-5 focus-within:ring-black focus-within:border-black">
                  <label
                    htmlFor="bordered-radio-1"
                    className="flex items-center w-full cursor-pointer"
                  >
                    <input
                      id="bordered-radio-1"
                      type="radio"
                      value="Standard"
                      name="bordered-radio"
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black"
                      onChange={handleStandardDelivery} // Call the Standard delivery handler
                    />
                    <span className="w-full py-4 ms-2 text-lg font-bold text-gray-900">
                      Standard
                      <span className="text-gray-600 text-md mx-3 font-normal">
                        15 - 40 mins
                      </span>
                    </span>
                  </label>
                </div>
              )}

              {/* Scheduled Delivery Option */}
              <div className="flex items-center ps-4 border-2 border-gray-200 rounded-lg mt-2 focus-within:ring-black focus-within:border-black">
                <label
                  htmlFor="bordered-radio-2"
                  className="flex items-center w-full cursor-pointer"
                >
                  <input
                    id="bordered-radio-2"
                    type="radio"
                    value="Scheduled"
                    name="bordered-radio"
                    className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black"
                    onChange={(e) => setSelectedDeliveryOption(e.target.value)} // Update selected option
                    onClick={openModal} // Open modal for schedule selection
                  />
                  <span className="w-full py-4 ms-2 text-lg font-bold text-gray-900">
                    Scheduled
                    <span className="text-gray-600 text-sm mx-3 font-normal">
                      {scheduledText}
                    </span>
                  </span>
                </label>
                {scheduledText !== "Select a date and time" && (
                  <button
                    type="button"
                    className="btn border-0 bg-transparent text-sm text-black ms-auto"
                    onClick={() => {
                      setIsEditing(true);
                      openModal(); // Open modal for editing
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {/* Time Picker Modal */}
              {isModalVisible && (
                <div
                  id="timepicker-modal"
                  tabIndex="-1"
                  aria-hidden="true"
                  className="fixed inset-0 z-[1050] flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
                >
                  <div className="relative p-4 w-full max-w-[50rem] max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {source === "booking"
                            ? "Select your Event Schedule"
                            : "Schedule an appointment"}
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-toggle="timepicker-modal"
                          onClick={closeModal}
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>

                      {/* Date & Time Picker */}
                      <div className="p-4 pt-0">
                        <div className="mx-auto sm:mx-0 flex justify-center my-5">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StaticDateTimePicker
                              orientation="landscape"
                              value={selectedDateTime}
                              onChange={(newValue) => {
                                const now = dayjs();
                                const minTime = now.add(45, "minute"); // 45 minutes includes preparation and delivery time

                                if (
                                  source !== "booking" &&
                                  newValue.isBefore(minTime)
                                ) {
                                  // Suggest the next available time
                                  const suggestedTime = minTime;
                                  setSelectedDateTime(suggestedTime);
                                  setScheduledText(
                                    suggestedTime.format("MMMM D, YYYY h:mm A")
                                  );

                                  Swal.fire({
                                    icon: "info",
                                    title: "Unavailable Time",
                                    text: `The selected time is unavailable. We’ve automatically set the next available time: ${suggestedTime.format(
                                      "MMMM D, YYYY h:mm A"
                                    )}.`,
                                  }).then(() => {
                                    // Close the modal after user acknowledges the suggestion
                                    closeModal();
                                  });
                                } else {
                                  setSelectedDateTime(newValue);
                                  setScheduledText(
                                    newValue.format("MMMM D, YYYY h:mm A")
                                  );
                                }
                              }}
                              shouldDisableDate={(date) =>
                                (Array.isArray(unavailableDates) &&
                                  unavailableDates.includes(date.format("MM-DD"))) 
                              }                              
                              minDate={dayjs()} // Prevent selecting past dates
                              disablePast // Ensure past times are disabled
                            />
                          </LocalizationProvider>
                        </div>

                        {/* Confirm Button */}
                        <button
                          className={`w-full px-4 py-2 text-white rounded-lg ${
                            unavailableDates.includes(
                              selectedDateTime.format("YYYY-MM-DD")
                            )
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-800"
                          }`}
                          onClick={handleConfirm}
                          disabled={unavailableDates.includes(
                            selectedDateTime.format("YYYY-MM-DD")
                          )}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Details */}
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              <h1 className="font-bold text-2xl text-black flex items-center">
                Personal Details
                {hasMobileNumber && (
                  <span
                    onClick={handleEditClick}
                    className="btn btn-ghost ml-auto w-[50px] cursor-pointer"
                  >
                    {isMobileEditing ? "Cancel" : "Edit"}
                  </span>
                )}
              </h1>

              {hasMobileNumber && !isMobileEditing ? (
                // Display personal details when the user has a mobile number
                <>
                  {currentUser ? (
                    <>
                      <p className="text-black font-semibold mt-6 text-sm">
                        {currentUser.firstName.toUpperCase() || "N/A"}{" "}
                        {currentUser.lastName || "N/A"}
                      </p>
                      <p className="text-black font-normal mt-1 text-sm">
                        {currentUser.email || "N/A"}
                      </p>
                      <p className="text-black font-normal mt-1 text-sm">
                        {mobileNumber  || "N/A"}
                      </p>
                    </>
                  ) : (
                    <p className="text-black font-semibold mt-6 text-sm">
                      Loading...
                    </p>
                  )}
                </>
              ) : (
                // Show editable fields when the user doesn't have a mobile number or is editing
                <>
                  {/* Email Field */}
                  <div className="relative mt-6">
                    <input
                      value={user.email || ""}
                      type="email"
                      id="email"
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                      placeholder=" "
                      disabled
                    />
                    <label
                      htmlFor="email"
                      className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Email
                    </label>
                  </div>

                  {/* First Name */}
                  <div className="relative mt-2">
                    <input
                      type="text"
                      id="firstName"
                      className="block px-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                      value={
                        firstName
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ") || ""
                      }
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder=" "
                    />
                    <label
                      htmlFor="firstName"
                      className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      First Name
                    </label>
                  </div>

                  {/* Last Name */}
                  <div className="relative mt-2">
                    <input
                      type="text"
                      id="lastName"
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                      value={
                        lastName.charAt(0).toUpperCase() +
                          lastName.slice(1).toLowerCase() || ""
                      }
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder=" "
                    />
                    <label
                      htmlFor="lastName"
                      className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Last Name
                    </label>
                  </div>

                  {/* Mobile Number */}
                  <div className="relative mt-4">
                    <input
                      type="text"
                      id="mobileNumber"
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                      value={mobileNumber || ""}
                      onChange={handleMobileNumberChange}
                      placeholder=" "
                    />
                    <label
                      htmlFor="mobileNumber"
                      className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Mobile Number
                    </label>
                    {mobileError && (
                      <p style={{ color: "red" }}>{mobileError}</p>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-start mt-6">
                    <button
                      onClick={handleSubmitMobileNumber}
                      type="submit"
                      className={`w-full py-3 text-white rounded-lg ${
                        isSaveEnabled
                          ? "bg-prime hover:bg-orange-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isSaveEnabled || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex justify-center items-center space-x-2">
                          <div className="w-5 h-5 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
                          <span>Sending OTP...</span>
                        </div>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* PASS TO MOBILENUMBEROMDAL */}
            {isMobileNumberModalVisible && (
              <MobileNumberModal
                mobileNumber={mobileNumber}
                currentUserId={currentUser._id}
                otpRecord={otpRecord}
                onClose={handleCloseMobileModal}
              />
            )}

            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow p-4 sm:p-6 md:p-8">
              <h1 className="font-bold text-[24px] text-black">Payment</h1>
              {source === "booking" ? (
                <div className="mt-4 ">
                  <h2 className="text-lg font-bold">Select Payment Option</h2>
                  <div className="flex items-center mt-4">
                    {/* Full Payment Option */}
                    <label className="flex items-center cursor-pointer mr-4">
                      <input
                        type="radio"
                        name="paymentAmount"
                        value="full"
                        checked={paymentAmount === orderTotal}
                        onChange={() => setPaymentAmount(orderTotal)}
                        className="mr-2"
                      />
                      <span className="text-black">
                        Full Payment (₱{orderTotal.toFixed(2)})
                      </span>
                    </label>
                    {/* Half Payment Option */}
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentAmount"
                        value="half"
                        checked={paymentAmount === orderTotal / 2}
                        onChange={() => setPaymentAmount(orderTotal / 2)}
                        className="mr-2"
                      />
                      <span className="text-black">
                        Down Payment (₱{(orderTotal / 2).toFixed(2)})
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                <p className="text-black font-medium">
                  Full payment required: ₱{orderTotal.toFixed(2)}
                </p>
              )}
            </div>

          
              <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow p-4 sm:p-6 md:p-8">
                <h1 className="font-bold text-[24px] text-black">Payment</h1>
                {/* GCash Option */}
                <div
                  className={`border-2 rounded-lg p-4 focus-within:ring-2 mb-3 ${
                    selectedPaymentMethod === "GCash"
                      ? "text-black border-black ring-black"
                      : "border-gray-200 text-black"
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="GCash"
                      className="mr-3 text-black focus:ring-black h-[20px] w-[20px]"
                      onChange={() => handlePaymentChange("GCash")}
                    />
                    <img
                      className="w-[45px] h-[35px] mr-3"
                      src="https://images.deliveryhero.io/image/foodpanda/payment_icons/payment_method/ic-payments-antfinancial_gcash-xs.png"
                      alt="GCash"
                    />
                    <span className="font-medium text-lg">
                      GCash (Alipay+ Partner)
                    </span>
                  </label>

                  {/* Conditionally render paragraph for GCash */}
                  {selectedPaymentMethod === "GCash" && (
                    <p className="mt-3 text-sm font-normal text-black font-sans">
                      You will be redirected to GCash after checkout. After
                      you&apos;ve performed the payment, you will be redirected
                      back to La Estellita.
                    </p>
                  )}
                </div>

                <div
                  className={`border-2 rounded-lg p-4 focus-within:ring-2 mb-3 ${
                    selectedPaymentMethod === "Paypal"
                      ? "text-black border-black ring-black"
                      : "border-gray-200 text-black"
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="Paypal"
                      className="mr-3 text-black focus:ring-black h-[20px] w-[20px]"
                      onChange={() => handlePaymentChange("Paypal")}
                    />
                    <img
                      className="w-[45px] h-[35px] mr-3"
                      src={paypal}
                      alt="Paypal"
                    />
                    <span className="font-medium text-lg">Paypal</span>
                  </label>

                  {selectedPaymentMethod === "Paypal" && (
                    <div id="paypal-button-container"></div>
                  )}
                </div>

                <div className="flex justify-start my-5">
                  <button
                    className="flex items-center bg-gray-100 border rounded-lg px-4 py-2 shadow hover:shadow-md transition cursor-pointer"
                    onClick={
                      () => document.getElementById("vouchermodal").showModal() // Open modal on click
                    }
                  >
                    <span className="text-prime text-xl mr-2">
                      <RiCoupon2Line />
                    </span>
                    <span className="font-medium text-md text-gray-700">
                      Apply a voucher
                    </span>
                  </button>

                  {/* VoucherModal component */}
                  <VoucherModal
                    vouchers={voucherList}
                    cartSubtotal={orderTotal}
                    onApplyVoucher={handleApplyVoucher}
                  />
                </div>
              </div>
    

            {/* CONTRACT */}
            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow p-4 sm:p-6 md:p-8">
              <h2 className="text-lg font-bold text-black">
                Contract Agreement
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                If you would like to sign a contract for your order, you can
                download the contract form below, review it, and upload a signed
                copy here.
              </p>
              <div className="mt-4">
                <a
                  href="/assets/contract-form.pdf"
                  download="LaEstellita_Contract_Form.pdf"
                  className="inline-flex items-center px-4 py-2 text-white bg-prime hover:bg-orange-700 font-medium rounded-lg"
                >
                  Download Contract Form
                </a>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Signed Contract
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>

              {isUploading && (
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              )}

              <div className="mt-6">
                <h3 className="text-md font-bold text-black">
                  Uploaded Contracts
                </h3>
                {uploadedFiles.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {uploadedFiles.map((file) => (
                      <li key={file._id} className="text-sm text-gray-600">
                        <a
                          href={`/${file.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {file.filePath.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    No contracts uploaded yet.
                  </p>
                )}
              </div>
            </div>

            {/*AGREEMENT  */}
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              <div className="flex items-start text-black">
                <input
                  type="checkbox"
                  className="checkbox mt-1 mr-4"
                  checked={isAgreementChecked}
                  onChange={(e) => setIsAgreementChecked(e.target.checked)}
                />
                <label className="text-left cursor-pointer font-medium text-gray-800">
                  I hereby give La Estellita the permission to share my customer
                  data with the Restaurant, and as applicable, their respective
                  affiliates and subsidiaries, for service improvement and/or
                  other related marketing purposes. I can find detailed
                  information about the customer data sharing{" "}
                  <a href="#" className="text-blue-500 underline">
                    <span className="link link-underline link-underline-black text-black">
                      here
                    </span>
                  </a>
                  .
                </label>
              </div>
            </div>

            {/* PLACE ORDER BUTTON */}
            <div className="mt-9">
              <button
                onClick={handlePlaceOrder}
                type="submit"
                className={`w-full justify-center py-3 border border-transparent shadow-sm text-md font-medium rounded-lg text-white ${
                  isAgreementChecked &&
                  selectedDeliveryOption &&
                  (isPaymentComplete || selectedPaymentMethod !== "Paypal") &&
                  currentUser?.address &&
                  (source !== "booking" ||
                    scheduledText !== "Select a date and time")
                    ? "bg-prime hover:bg-orange-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={
                  !isAgreementChecked ||
                  !selectedDeliveryOption ||
                  (selectedPaymentMethod === "Paypal" && !isPaymentComplete) ||
                  !currentUser?.address ||
                  (source === "booking" &&
                    scheduledText === "Select a date and time")
                }
              >
                Place Order
              </button>
            </div>
            {/*CONDITION */}
            <p className="text-white mt-4 text-xs">
              By making this purchase you agree to our terms and conditions.
            </p>
            <p className="text-white mt-4 text-xs">
              I agree that placing the order places me under an obligation to
              make a payment in accordance with the General Terms and
              Conditions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
