import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import avatarImg from "/images/avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import useUsers from "../hooks/useUser";

const Profile = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { users } = useUsers();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);  // Manage drawer state

  const currentUser = users.find((u) => u.email === user.email);

  // Logout function
  const handleLogout = () => {
    logOut()
      .then(() => {
        // Sign-out successful.
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Toggle drawer visibility when avatar is clicked
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  // Close the drawer if the click is outside the avatar or drawer
  const closeDrawerOnClickOutside = (e) => {
    if (
      !e.target.closest("#my-drawer-4") && // Check if click is outside drawer
      !e.target.closest(".avatar")          // Check if click is outside avatar
    ) {
      setIsDrawerOpen(false);  // Close the drawer if outside click
    }
  };

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("click", closeDrawerOnClickOutside);

    // Cleanup event listener on unmount
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
          checked={isDrawerOpen}  // Controlled state for the drawer
          onChange={() => {}}  // Prevent direct manipulation by user
        />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
            onClick={toggleDrawer}  // Toggle the drawer when avatar is clicked
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
            {/* Sidebar content here */}
            <li>
              <a href="/update-profile">Profile</a>
            </li>
            <li>
              <a href="/order-tracking/:transactionId">Order</a>
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
