import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import {
  FaEdit,
  FaLocationArrow,
  FaPlusCircle,
  FaQuestionCircle,
  FaShoppingBag,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Login from "../components/Login";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

const sharedLinks = (
  <>
    <li className="mt-3">
      <Link to="/">
        <MdDashboard /> Home
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaCartShopping /> Menu
      </Link>
    </li>
  </>
);

const SidebarContent = () => (
  <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 my-16">
    {/* Sidebar content here */}
    <hr />
    <li>
      <Link to="/dashboard">
        <MdDashboard /> Dashboard
      </Link>
    </li>
    <li>
      <details>
        <summary className="cursor-pointer">
          <FaPlusCircle /> Add Items
        </summary>
        <ul className="pl-4">
          <li>
            <Link to="/dashboard/add-menu">Add Menu</Link>
          </li>
          <li>
            <Link to="/dashboard/add-package">Add Food Package</Link>
          </li>
          <li>
            <Link to="/dashboard/add-rental">Add Rental</Link>
          </li>
          <li>
            <Link to="/dashboard/add-venue">Add Venue</Link>
          </li>
          <li>
            <Link to="/dashboard/add-voucher">Add Voucher</Link>
          </li>
        </ul>
      </details>
    </li>

    <li>
      <details>
        <summary className="cursor-pointer">
          <FaShoppingBag /> Orders
        </summary>
        <ul className="pl-4">
          <li>
            <Link to="/dashboard/pending-orders">Pending Orders</Link>
          </li>
          <li>
            <Link to="/dashboard/confirm-orders">Confirm Orders</Link>
          </li>
          <li>
            <Link to="/dashboard/completed-orders">Completed Orders</Link>
          </li>
          <li>
            <Link to="/dashboard/cancelled-orders">Cancelled Orders</Link>
          </li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary className="cursor-pointer">
          <FaShoppingBag /> Bookings
        </summary>
        <ul className="pl-4">
          <li>
            <Link to="/dashboard/pending-bookings">Pending Bookings</Link>
          </li>
          <li>
            <Link to="/dashboard/confirm-bookings">Confirm Bookings</Link>
          </li>
          <li>
            <Link to="/dashboard/completed-bookings">Completed Bookings</Link>
          </li>
          <li>
            <Link to="/dashboard/cancelled-bookings">Cancelled Bookings</Link>
          </li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary className="cursor-pointer">
          <FaEdit /> Manage
        </summary>
        <ul className="pl-4">
          <li>
            <Link to="/dashboard/manage-items">Manage Foods</Link>
          </li>
          <li>
            <Link to="/dashboard/manage-rentals">Manage Rentals</Link>
          </li>
          <li>
            <Link to="/dashboard/manage-venues">Manage Venues</Link>
          </li>
          <li>
            <Link to="/dashboard/manage-packages">Manage Packages</Link>
          </li>
          <li>
            <Link to="/dashboard/manage-contracts">Manage Contracts</Link>
          </li>
          <li>
            <Link to="/dashboard/manage-vouchers">Manage Vouchers</Link>
          </li>
          <li>
            <Link to="/dashboard/users">Manage Users</Link>
          </li>
        </ul>
      </details>
    </li>
    <li>
      <Link to="/dashboard/salesreport">Sales Report</Link>
    </li>
    <li>
      <Link to="/dashboard/inbox">Inbox</Link>
    </li>
    <hr />
    {sharedLinks}
  </ul>
);

const DashboardLayout = () => {
  const { loading, user } = useAuth(); // Fetch user info
  const [isAdmin] = useAdmin();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [notifications, setNotifications] = useState([
    { message: "New order received", link: "/dashboard/pending-orders" },
    { message: "Booking confirmed", link: "/dashboard/confirm-bookings" },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const toggleNotificationPopover = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <div>
      {isAdmin ? (
        <div>
          {/* Navbar */}
          <div className="navbar bg-base-100 shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="navbar-start">
              <label
                htmlFor="my-drawer"
                className="btn btn-ghost btn-circle drawer-button"
                onClick={() => setIsClicked(!isClicked)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {/* Top Line */}
                  <line
                    x1="4"
                    y1="6"
                    x2={isClicked ? "12" : "20"}
                    y2="6"
                    className="stroke-current transition-all duration-300"
                  />

                  {/* Middle Line */}
                  <line
                    x1="4"
                    y1="12"
                    x2="20"
                    y2="12"
                    className="stroke-current transition-all duration-300"
                  />

                  {/* Bottom Line */}
                  <line
                    x1="4"
                    y1="18"
                    x2={isClicked ? "12" : "20"}
                    y2="18"
                    className="stroke-current transition-all duration-300"
                  />
                </svg>
              </label>
            </div>
            <div className="navbar-center">
              <Link to="/dashboard">
                <span className="badge badge-primary">ADMIN DASHBOARD</span>
              </Link>
            </div>

            <div className="navbar-end">
              {/* Profile Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                  onClick={toggleProfileDropdown}
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="User Avatar"
                      src={user?.photoURL || "/images/avatar-placeholder.png"}
                    />
                  </div>
                </div>
                {isProfileOpen && (
                  <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Drawer */}
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content pt-16">
              {/* Page content here */}
              <Outlet />
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <SidebarContent />
            </div>
          </div>
        </div>
      ) : loading ? (
        <Login />
      ) : (
        <div className="h-screen flex justify-center items-center">
          <Link to="/">
            <button className="btn bg-prime text-white">Back to Home</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
