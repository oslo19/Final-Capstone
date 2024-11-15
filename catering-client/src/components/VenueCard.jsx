import React, { useState } from 'react';
import useVenue from '../hooks/useVenue';

const VenueCard = () => {
  const [venue, loading] = useVenue(); // Fetch venue data
  const [currentIndex, setCurrentIndex] = useState(0); // Track current image index

  if (loading) {
    return <p>Loading...</p>;
  }

  // Navigate to the previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? venue.length - 1 : prevIndex - 1
    );
  };

  // Navigate to the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === venue.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Image display */}
      <div className="relative">
        <img
          src={venue[currentIndex]?.image}
          alt={`Venue ${currentIndex + 1}`}
          className="w-full h-64 object-cover rounded-lg"
        />

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg text-gray-700"
        >
          ❮
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg text-gray-700"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default VenueCard;
