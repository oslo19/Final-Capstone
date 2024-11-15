import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../../src/App.css";
import Footer from "../components/Footer";
import { AuthContext } from "../contexts/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";

const Main = () => {
  const { loading } = useContext(AuthContext);
  
  return (
    <div className="bg-prigmayBG">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 md:min-h- border-gray-200 shadow">
          <Navbar />
          <div className="min-h-screen">
            <Outlet />
          </div>
          <div className="mt-24">
          <Footer />
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
