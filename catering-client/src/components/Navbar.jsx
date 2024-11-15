import React, { useContext, useEffect, useState } from "react";
import logo from "/logo.png";
import { FaRegUser } from "react-icons/fa";

import Profile from "./Profile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { SlLocationPin } from "react-icons/sl";
import Swal from 'sweetalert2';
import { IoLocationSharp } from "react-icons/io5";
import useCart from "../hooks/useCart";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, refetch] = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = (
    <>
      <li>
        <a href="/" className=" hover:text-prime">
          Home
        </a>
      </li>
      <li tabIndex={0}>
        <a href="/menu" className="hover:text-prime">Menu</a>
      </li>
      <li tabIndex={0}>
        <a href="/rental" className="hover:text-prime">Event Rental</a>
      </li>
      <li tabIndex={0}>
        <a href="/venue" className="hover:text-prime">Venue</a>
      </li>
      {user && (
      <li tabIndex={0}>
        <a href="/book" className=" hover:text-prime">Book now</a>
      </li>
      )}
    </>
  );

  return (
    <header
      className={`bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 md:min-h- border-gray-200 rounded-lg shadow text-white bg-max-w-screen-2xl mx-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`navbar xl:px-24 ${isSticky
          ? "shadow-md bg-black-100 transition-all duration-300 ease-in-out"
          : ""
          }`}
      >
        <div className="navbar-start">
          <a href="/">
            <img src={logo} alt="" />
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal text-md space-x-5">{navItems}</ul>
        </div>

        <div className="navbar-end">
          <div className="form-control"></div>

          {/* Show shopping cart only if the user is logged in */}
          {user && (
            <Link to="/cart-page">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle lg:flex items-center justify-center mr-3"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">{cart.length || 0}</span>
                </div>
              </label>
            </Link>
          )}

          {/* Login button */}
          {user ? (
            <Profile user={user} />
          ) : (
            <button
              onClick={() => navigate('/login', { state: { from: location } })}
              className="flex items-center gap-2 rounded-full px-6 bg-orange text-prime"
            >
              <FaRegUser /> Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
