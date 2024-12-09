import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import avatarImg from "/images/avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import useUsers from "../hooks/useUser";
import useOrder from "../hooks/useOrder";

const Profile = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { users } = useUsers();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { orders, refetch } = useOrder();

  // Find the current user from the users list
  const currentUser = users.find((u) => u.email === user.email);

  // Find orders for the current user
  const currentUserCartOrder = orders.find(
    (o) => o.email === currentUser?.email && o.source === "cart"
  );
  const currentUserBookingOrder = orders.find(
    (o) => o.email === currentUser?.email && o.source === "booking"
  );

  // Logout function
  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Navigate to order-tracking
  const handleOrderClick = () => {
    if (currentUserCartOrder?.transactionId) {
      navigate(`/order-tracking/${currentUserCartOrder.transactionId}`);
    } else {
      console.log("No cart order transactionId found.");
    }
  };

  // Navigate to booking order
  const handleBookingClick = () => {
    if (currentUserBookingOrder?.transactionId) {
      navigate(`/order/${currentUserBookingOrder.transactionId}`);
    } else {
      console.log("No booking transactionId found.");
    }
  };

  // Toggle drawer visibility when avatar is clicked
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  // Close the drawer if the click is outside the avatar or drawer
  const closeDrawerOnClickOutside = (e) => {
    if (
      !e.target.closest("#my-drawer-4") &&
      !e.target.closest(".avatar")
    ) {
      setIsDrawerOpen(false);
    }
  };

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("click", closeDrawerOnClickOutside);
    return () => {
      document.removeEventListener("click", closeDrawerOnClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => {}}
        />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
            onClick={toggleDrawer}
          >
            <div className="w-10 rounded-full">
              {user.photoURL ? (
                <img alt="" src={user.photoURL} />
              ) : (
                <img alt="" src={avatarImg} />
              )}
            </div>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li>
              <a onClick={handleOrderClick}>Order</a>
            </li>
            <li>
              <a onClick={handleBookingClick}>Booking</a>
            </li>
            {currentUser?.role === "admin" && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
