import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar"; // Custom Navbar for Admin
import "../../src/App.css";
import Footer from "../components/Footer"; // Can reuse the same Footer or create AdminFooter
import { AuthContext } from "../contexts/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminMain = () => {
  const { loading } = useContext(AuthContext);

  return (
    <div className="bg-gray-900">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 min-h-screen">
          {/* Admin Navbar */}
          <AdminNavbar />
          <div className="min-h-screen">
            {/* Render the admin-specific content */}
            <Outlet />
          </div>
          {/* Footer */}
          <Footer />
        </div>
      )}
    </div>
  );
};

export default AdminMain;
