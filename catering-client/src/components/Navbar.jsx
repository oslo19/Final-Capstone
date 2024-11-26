import React, { useEffect, useState } from "react";
import logo from "/logo.png";
import { FaRegUser } from "react-icons/fa";
import Profile from "./Profile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart] = useCart();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setSticky(offset > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchQuery) {
      Swal.fire("Error", "Please enter an RCode to search.", "error");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/orders/${searchQuery}`);
      if (!response.ok) {
        throw new Error("Order not found.");
      }

      const orderData = await response.json();

      if (orderData.source === "booking") {
        navigate("/order", { state: { order: orderData } });
      } else if (orderData.source === "cart") {
        navigate(`/order-tracking/${orderData.transactionId}`);
      } else {
        throw new Error("Invalid order source.");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const navItems = (
    <>
      <li>
        <a href="/" className="hover:text-prime">
          Home
        </a>
      </li>
      <li>
        <a href="/menu" className="hover:text-prime">
          Menu
        </a>
      </li>
      <li>
        <a href="/rental" className="hover:text-prime">
          Event Rental
        </a>
      </li>
      <li>
        <a href="/venue" className="hover:text-prime">
          Venue
        </a>
      </li>
      {user && (
        <li>
          <a href="/book" className="hover:text-prime">
            Book now
          </a>
        </li>
      )}
    </>
  );

  return (
    <header
      className={`bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSticky ? "shadow-md bg-black" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Hamburger Menu (Visible on Mobile Only) */}
        <button
          className="lg:hidden flex items-center text-white focus:outline-none mr-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Logo (Visible on Large Screens) */}
        <a href="/" className="text-3xl font-bold hidden lg:block">
          <img src={logo} alt="Logo" className="h-10" />
        </a>

        {/* Navigation Items (Visible on Large Screens Only) */}
        <ul className="hidden lg:flex space-x-16 items-center mx-auto">
          {navItems}
        </ul>

        {/* Right Menu (Search Bar, Cart, Profile/Login) */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex-1 mx-auto max-w-md">
            <input
              type="search"
              id="search-query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-2 pl-10 text-sm border rounded-lg bg-gray-50 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search by RCode..."
              required
            />
          </form>

          {/* Cart */}
          {user && (
            <Link to="/cart-page" className="btn btn-ghost btn-circle">
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
                <span className="badge badge-sm indicator-item">
                  {cart.length || 0}
                </span>
              </div>
            </Link>
          )}

          {/* Profile (Visible on Desktop) */}
          {user ? (
            <Profile user={user} />
          ) : (
            <button
              onClick={() => navigate("/login", { state: { from: location } })}
              className="flex gap-2 items-center px-6 py-2 text-prime bg-orange rounded-full lg:flex md:hidden"

            >
              <FaRegUser /> Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`z-[1050] lg:hidden absolute top-0 left-0 w-full bg-black bg-opacity-90 text-white transform ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        } transition-transform duration-300`}
      >
        <div className="container mx-auto px-4 py-6">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <ul className="flex flex-col space-y-4 items-center">
            {navItems}        
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
