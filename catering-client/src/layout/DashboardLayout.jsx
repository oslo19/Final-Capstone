import React from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import {
  FaEdit,
  FaLocationArrow,
  FaPlusCircle,
  FaQuestionCircle,
  FaRegUser,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";

import logo from "/logo.png";
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
        <Link to="/menu"><FaCartShopping/> Menu</Link>
    </li>
    <li>
        <Link to="/menu"><FaLocationArrow/> Orders Tracking</Link>
    </li>
    <li>
        <Link to="/menu"><FaQuestionCircle/> Customer Support</Link>
    </li>
  </>
);

const DashboardLayout = () => {
  const {loading} = useAuth()
  const [isAdmin, isAdminLoading] = useAdmin()
  return (
    <div>
    {
      isAdmin ?   <div className="drawer sm:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
        {/* Page content here */}
        <div className="flex items-center justify-between mx-4">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <MdDashboardCustomize />
          </label>
          <button className="btn rounded-full px-6 bg-prime flex items-center gap-2 text-white sm:hidden">
            <FaRegUser /> Logout
          </button>
        </div>
        <div className="mt-5 md:mt-2 mx-4">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <Link to="/dashboard" className="flex justify-start mb-3">
              <img  alt="" className="w-6" />
              <span className="badge badge-primary">ADMIN DASHBOARD</span>
            </Link>
          </li>
          <hr />
          <li className="mt-3">
            <Link to="/dashboard">
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/add-menu">
              <FaPlusCircle />
              Add Menu
            </Link>
          </li>
          <li>
            <Link to="/dashboard/add-package">
              <FaPlusCircle />
              Add Food Package
            </Link>
          </li>
          <li>
            <Link to="/dashboard/add-rental">
              <FaPlusCircle />
              Add Rental
            </Link>
          </li>
          <li>
            <Link to="/dashboard/add-venue">
              <FaPlusCircle />
              Add Venue
            </Link>
          </li>
          <li>
            <Link to="/dashboard/add-voucher">
              <FaPlusCircle />
              Add Voucher
            </Link>
          </li>
          <li>
            <Link to="/dashboard/manage-bookings">
              <FaShoppingBag /> Manage Bookings
            </Link>
          </li>
          <li>
            <Link to="/dashboard/manage-items">
              <FaEdit /> Manage Foods
            </Link>
          </li>
          <li>
            <Link to="/dashboard/manage-rentals">
              <FaEdit /> Manage Rentals
            </Link>
          </li>
          <li>
            <Link to="/dashboard/manage-venues">
              <FaEdit /> Manage Venues
            </Link>
          </li>
          <li>
            <Link to="/dashboard/manage-vouchers">
              <FaEdit /> Manage Vouchers
            </Link>
          </li>
          <li className="">
            <Link to="/dashboard/orderconfirmed">
              <FaUser /> Booking Confirmed
            </Link>
          </li>
          <li className="">
            <Link to="/dashboard/users">
              <FaUser /> All Users
            </Link>
          </li>
          <hr />
      

          {/* shared nav links */}
          {
              sharedLinks
          }
        </ul>
      </div>
    </div> : (loading ? <Login/> : <div className="h-screen flex justify-center items-center"><Link to="/"><button className="btn bg-prime text-white">Back to Home</button></Link></div>)
    }
    </div>
  );
};

export default DashboardLayout;
