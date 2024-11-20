import React, { useState } from "react";
import useVenue from "../hooks/useVenue";
import { IoPeopleSharp } from "react-icons/io5";
import { FaChair } from "react-icons/fa";
import { Link } from "react-router-dom";

const VenueCard = () => {
  const [venues, loading] = useVenue(); // Fetch venue data
  const [imageIndices, setImageIndices] = useState({}); // Store current image indices for all venues

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  const handleNextImage = (index) => {
    setImageIndices((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1 >= venues[index].images.length ? 0 : (prev[index] || 0) + 1,
    }));
  };

  const handlePrevImage = (index) => {
    setImageIndices((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) - 1 < 0 ? venues[index].images.length - 1 : (prev[index] || 0) - 1,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {venues.map((item, index) => {
        const currentImageIndex = imageIndices[index] || 0;

        return (
          <div
            key={index}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Image Slider Section */}
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src={
                  Array.isArray(item.images) && item.images.length > 0
                    ? item.images[currentImageIndex]
                    : "https://via.placeholder.com/150"
                }
                alt={item.venueName}
              />

              {/* Left and Right Arrows */}
              {Array.isArray(item.images) && item.images.length > 1 && (
                <div className="absolute inset-0 flex justify-between items-center px-2">
                  <button
                    onClick={() => handlePrevImage(index)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition"
                  >
                    ❮
                  </button>
                  <button
                    onClick={() => handleNextImage(index)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition"
                  >
                    ❯
                  </button>
                </div>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {item.images &&
                  item.images.slice(0, 5).map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === currentImageIndex ? "bg-white" : "bg-white opacity-70"
                      }`}
                    ></span>
                  ))}
              </div>
            </div>

            {/* Venue Details Section */}
            <div className="p-4">
              <h5 className="text-lg font-semibold text-gray-800">{item.venueName}</h5>
              <p className="text-sm text-gray-500">
                {item.address || "Location not specified"}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xl font-semibold text-gray-900">₱{item.rentalPrice}</span>
                <div className="flex items-center space-x-3 text-gray-600">
                <div className="flex items-center">
                    <FaChair />
                    <span className="ml-1">{item.capacity}</span>
                  </div>
                  <div className="flex items-center">
                    <IoPeopleSharp />
                    <span className="ml-1">{item.capacity}</span>
                  </div>
                </div>
              </div>
              <Link to={`/venuedetails/${item._id}`}>
              <button className="mt-4 w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                See more details...
              </button>
              </Link>         
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VenueCard;
