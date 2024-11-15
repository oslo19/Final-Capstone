import React, { useEffect, useRef, useState } from 'react';

const Venue = () => {
  const scrollRef = useRef(null);
  const [isLeftArrowVisible, setIsLeftArrowVisible] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.firstChild.offsetWidth + 32; // Include item width and spacing (32px gap)
      const currentScroll = scrollRef.current.scrollLeft;

      if (direction === 'left') {
        // Calculate the new scroll position
        const newScrollPosition = Math.max(currentScroll - itemWidth, 0);

        // Only scroll if the target position is different from the current position
        if (currentScroll > 0) {
          scrollRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
        }
      } else {
        // Scroll one item right
        const newScrollPosition = currentScroll + itemWidth;
        scrollRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      // Show left arrow only if not at the first item
      setIsLeftArrowVisible(scrollRef.current.scrollLeft > 0);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const venues = [
    { name: "Corporate Event - Dining", icon: "🍽️" },
    { name: "Corporate Event - Media & Press", icon: "📰" },
    { name: "Corporate Event - Large Scale", icon: "🏛️" },
    { name: "Corporate Event - Party", icon: "🎉" },
    { name: "Business Meeting", icon: "💼" },
    { name: "Team Building", icon: "👥" },
    { name: "Birthday Parties", icon: "🎂" },
    { name: "Kid Birthday Parties", icon: "🎈" },
    { name: "Weddings", icon: "💍" },
    { name: "Shoots", icon: "📸" }
  ];

  return (
    <div className="relative w-full flex items-center mt-14">
      {/* Sticky "All Venues" */}
      <div className="flex items-center space-x-2 pr-4 border-r border-gray-300">
        <div className="flex flex-col items-center min-w-max">
          <span className="text-4xl">📄</span>
          <span className="text-lg mt-2 text-white">All Venues</span>
        </div>
      </div>

      {/* Left Arrow */}
      {isLeftArrowVisible && (
        <button
          onClick={() => scroll('left')}
          className="absolute p-12 text-gray-800 text-2xl bg-transparent  focus:outline-none"
          style={{ zIndex: 1, left: '4.5rem' }} // Position it appropriately
        >
          ❮
        </button>
      )}

      {/* Venue Items Container */}
      <div
        ref={scrollRef}
        className="flex overflow-hidden space-x-8 py-4 px-4 bg-white border-gray-300 w-full"
      >
        {venues.map((venue, index) => (
          <div key={index} className="flex flex-col items-center min-w-[280px]">
            <span className="text-4xl">{venue.icon}</span>
            <span className="text-lg mt-2 text-gray-700">{venue.name}</span>
          </div>
        ))}
      </div>
        
      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 p-12 rounded-full bg-transparent text-gray-800 w-10 text-2xl"
        style={{ zIndex: 1 }}
      >
        ❯
      </button>
    </div>
  );
};

export default Venue;
