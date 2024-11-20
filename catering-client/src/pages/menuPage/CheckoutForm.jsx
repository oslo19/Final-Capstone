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
  const [isEditing, setIsEditing] = useState(false); // New state to control edit mode
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [cart] = useCart();
  const [isMobileNumberModalVisible, setIsMobileNumberModalVisible] =
    useState(false);
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
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  console.log("Location State:", location.state);

  console.log();
  const {
    menuItems = [],
    rentalItems = [],
    venueItems = [],
    orderTotal = 0,
    source,
    typeOfEvent,
    numberOfPax,
    typeOfMenu,
  } = location.state || {}; // Destructure the state values

  useEffect(() => {
    if (selectedPaymentMethod === "Paypal") {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        window.paypal
          .Buttons({
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
            onApprove: async (data, actions) => {
              const details = await actions.order.capture();
              console.log("Payment Successful:", details);

              const orderData = {
                email: user.email,
                transactionId: details.id,
                price: orderTotal,
                status: "order pending",
                source: "cart",
                items: {
                  menuItems,
                  rentalItems,
                  venueItems,
                },
                createdAt: new Date(),
              };

              try {
                const response = await fetch("http://localhost:6001/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(orderData),
                });

                if (response.ok) {
                  await clearCart(); // Clear the cart after saving the order
                  Swal.fire(
                    "Success",
                    "Payment processed successfully. Order placed!",
                    "success"
                  );
                  navigate("/order");
                } else {
                  throw new Error("Failed to save order.");
                }
              } catch (error) {
                console.error("Error saving order:", error);
                Swal.fire("Error", error.message, "error");
              }
            },
            onError: (err) => {
              console.error("PayPal Payment Error:", err);
              Swal.fire("Error", "Payment failed. Please try again.", "error");
            },
          })
          .render("#paypal-button-container");
      } else {
        console.error("PayPal button container does not exist!");
      }
    }
  }, [
    selectedPaymentMethod,
    orderTotal,
    user,
    menuItems,
    rentalItems,
    venueItems,
    navigate,
  ]);

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

      if (currentUser && currentUser.mobileNumber) {
        setMobileNumber(currentUser.mobileNumber);
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
        refetch();
        Swal.fire("Success", "Address updated successfully", "success");

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
      modal.showModal(); // Show the modal using getElementById
    }
  };

  {
    /*Address Logic END*/
  }

  {
    /*Delivery Option Logic */
  }
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const handleConfirm = () => {
    const formattedDate = selectedDateTime.format("MMMM D, YYYY h:mm A");
    setScheduledText(formattedDate);
    setIsEditing(false);
    closeModal();
    
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

    // Enable the Save button if the input matches the valid pattern
    setIsSaveEnabled(isValidMobileNumber(value));
  };
  const handleSubmitMobileNumber = async (e) => {
    e.preventDefault();
    const formattedNumber = `+63${
      mobileNumber.startsWith("0") ? mobileNumber.slice(1) : mobileNumber
    }`;

    try {
      console.log("Saving phone number:", formattedNumber); // Debugging log

      // Save mobile number to the current user's profile
      const response = await axiosSecure.patch(
        `/users/${currentUser._id}/mobile`,
        {
          phone_number: formattedNumber,
        }
      );

      if (response.status === 200) {
        await refetch();

        const updatedUser = users.find((u) => u.email === user.email);
        if (updatedUser && updatedUser.mobileNumber) {
          setMobileNumber(updatedUser.mobileNumber); // Display the formatted number
        }

        setIsMobileNumberModalVisible(true); // Show the OTP modal
      } else {
        throw new Error(
          response.data.message || "Failed to save mobile number"
        );
      }
    } catch (error) {
      console.error("Error saving mobile number:", error); // Log the error
      Swal.fire("Error", error.message, "error");
    }
  };
  const handleCloseMobileModal = () => {
    setIsMobileNumberModalVisible(false);
  };
  const handlePaymentChange = (method) => {
    setSelectedPaymentMethod(method);
  };
  const hasMobileNumber = currentUser && currentUser.mobileNumber;
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
        const response = await axios.get("http://localhost:6001/voucher");
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
  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setIsProcessing(true); // Start processing the order

    try {
      // Call your backend to create a payment intent
      const paymentIntentResponse = await axios.post(
        "http://localhost:6001/create-payment-intent",
        {
          price: finalTotal, // Send the final total price
        }
      );

      // Assuming the response contains client_secret for Stripe or PayMongo equivalent
      const { clientSecret } = paymentIntentResponse.data;

      if (!clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // Handle GCash payment
      if (selectedPaymentMethod === "gcash") {
        // Redirect to GCash payment link (replace with actual PayMongo link)
        window.location.href = `https://paymongo.com/${clientSecret}`; // Example URL, replace with the correct one.
      }

      // Stripe Payment Confirmation (adjust this logic to your actual payment method)
      if (selectedPaymentMethod === "card") {
        // For Stripe (you might be using stripe.js or Stripe Elements here)
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: elements.getElement(CardElement), // Assuming you're using Stripe Elements
        });

        if (error) {
          console.error("Payment failed:", error);
          Swal.fire("Error", "Payment failed. Please try again.", "error");
          setIsProcessing(false);
          return;
        }
      }

      // After payment is successful, save order in the backend
      const orderData = {
        email: user.email,
        transactionId: clientSecret, // Transaction ID from payment gateway
        price: finalTotal,
        status: "order pending",
        source: "cart",
        items: {
          menuItems,
          rentalItems,
          venueItems,
        },
        createdAt: new Date(),
      };

      const orderResponse = await fetch("http://localhost:6001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (orderResponse.ok) {
        // Clear the cart after successfully saving the order
        await clearCart();

        Swal.fire(
          "Success",
          "Payment processed successfully. Order placed!",
          "success"
        );
        navigate("/order");
      } else {
        throw new Error("Failed to save order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsProcessing(false); // End the order processing
    }
  };

  const clearCart = async () => {
    try {
      // Clear menu items
      if (menuItems.length > 0) {
        for (const item of menuItems) {
          await axios.delete(`http://localhost:6001/booking-cart/${item._id}`);
        }
      }

      // Clear rental items
      if (rentalItems.length > 0) {
        for (const item of rentalItems) {
          await axios.delete(
            `http://localhost:6001/booking-rental-cart/${item._id}`
          );
        }
      }

      // Clear venue items
      if (venueItems.length > 0) {
        for (const item of venueItems) {
          await axios.delete(
            `http://localhost:6001/booking-venue-cart/${item._id}`
          );
        }
      }

      Swal.fire("Success", "Cart cleared successfully.", "success");
    } catch (error) {
      console.error("Error clearing cart:", error);
      Swal.fire(
        "Error",
        "Failed to clear the cart. Please try again.",
        "error"
      );
    }
  };

  return (
    <>
      <div className="max-w-screen-2xl container px-4">
        <div className="flex flex-col md:flex-row-reverse items-start justify-between">
          {/* Order Summary */}
          <div className="md:w-1/3 mr-28">
            <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              <h1 className="font-bold text-2xl">Order Summary</h1>

              {/* Display Type of Event, Number of Pax, and Type of Menu only for bookings */}
              {source === "booking" && (
                <div className="mt-4">
                  <div className="flex justify-between mb-2 font-medium text-sm text-gray-500">
                    <p>Type of Event:</p>
                    <p className="font-bold text-black">
                      {typeOfEvent
                        ? typeOfEvent.charAt(0).toUpperCase() +
                          typeOfEvent.slice(1)
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between mb-2 font-medium text-sm text-gray-500">
                    <p>Number of Pax:</p>
                    <p className="font-bold text-black">
                      {numberOfPax || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between mb-2 font-medium text-sm text-gray-500">
                    <p>Type of Menu:</p>
                    <p className="font-bold text-black">
                      {typeOfMenu || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {/* Check if the source is "booking" */}
              {source === "booking" ? (
                <>
                  {/* Booking Menu Items */}
                  {menuItems.length > 0 && (
                    <>
                      <h2 className="text-lg font-semibold mt-4">Menu Items</h2>
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
                      <h2 className="text-lg font-semibold mt-4">Amenities</h2>
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

              <div className="divider my-4"></div>

              {/* Subtotal */}
              <div className="flex justify-between font-medium text-gray-500 text-md">
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
                <div className="flex justify-between font-medium text-gray-500 text-md mt-3">
                  <p>Discount</p>
                  <p className="font-bold text-green-600">
                    -₱ {discount.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Delivery Fee */}
              <div className="flex justify-between font-medium text-gray-500 text-md mt-3">
                <p>Scheduled delivery</p>
                <p className="font-bold text-black">
                  ₱ {deliveryFee.toFixed(2)}
                </p>
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-xl mt-6">
                <p>Total</p>
                <p>₱ {finalTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="text-white w-full md:w-1/2 ml-12">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
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
                        className="absolute start-2 text-xs cursor-text left-1 -top-2.5 text-gray-400 bg-gray-50 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-black peer-focus:text-xs transition-all "
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
                      onClick={(e) => {
                        e.preventDefault();
                        modal.showModal();
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

            {/*Delivery Option */}
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
                      value=""
                      name="bordered-radio"
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black"
                    />
                    <span className="w-full py-4 ms-2 text-lg font-bold text-gray-900">
                      Standard
                      <span className="text-gray-600 text-md mx-3 font-normal">
                        5 - 20 mins
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
                    name="bordered-radio"
                    className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black"
                    onClick={openModal}
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
                  className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
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
                              onChange={(newValue) =>
                                setSelectedDateTime(newValue)
                              }
                              minDate={dayjs()} // Prevent selecting past dates
                            />
                          </LocalizationProvider>
                        </div>

                        {/* Confirm Button */}
                        <button
                          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                          onClick={handleConfirm}
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
            {hasMobileNumber && isMobileEditing ? (
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

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* First Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      className="block px-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                      value={firstName}
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
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                      value={lastName}
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
                </div>

                {/* Mobile Number */}
                <div className="relative mt-4">
                  <input
                    type="text"
                    id="mobileNumber"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    placeholder=" "
                  />
                  <label
                    htmlFor="mobileNumber"
                    className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Mobile Number
                  </label>
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
                    disabled={!isSaveEnabled}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
                <h1 className="font-bold text-2xl text-black flex items-center">
                  Personal Details
                  {hasMobileNumber && (
                    <span
                      onClick={handleEditClick}
                      className="btn btn-ghost ml-auto w-2 cursor-pointer"
                    >
                      {isMobileEditing ? "Cancel" : "Edit"}
                    </span>
                  )}
                </h1>
                {currentUser ? (
                  <>
                    <p className="text-black font-semibold mt-6 text-sm">
                      {currentUser.firstName || "N/A"}{" "}
                      {currentUser.lastName || "N/A"}
                    </p>
                    <p className="text-black font-normal mt-1 text-sm">
                      {currentUser.email || "N/A"}
                    </p>
                    <p className="text-black font-normal mt-1 text-sm">
                      {currentUser.mobileNumber || "N/A"}
                    </p>
                  </>
                ) : (
                  <p className="text-black font-semibold mt-6 text-sm">
                    Loading...
                  </p>
                )}
              </div>
            )}

            {/* PASS TO MOBILENUMBEROMDAL */}
            {isMobileNumberModalVisible && (
              <MobileNumberModal
                mobileNumber={mobileNumber}
                currentUserId={currentUser._id}
                onClose={handleCloseMobileModal}
              />
            )}

            {/*PAYMENT DETAILS */}
            {hasMobileNumber && (
              <div className="mt-4  bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-6">
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
                      back to Foodpanda.
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
            )}

            {/*AGREEMENT  */}
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              <div className="flex items-start text-black">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox mt-1 mr-4"
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

            {/*PLAC ORDER BUTTON */}
            <div className="mt-9">
              <button
                onClick={handlePlaceOrder}
                type="submit"
                className="w-full justify-center py-3 border border-transparent shadow-sm text-md font-medium rounded-lg text-white bg-prime hover:bg-orange-700"
              >
                Place order
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
