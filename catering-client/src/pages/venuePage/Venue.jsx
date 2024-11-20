import React, { useEffect, useRef, useState } from "react";
import VenueCard from "../../components/VenueCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Venue = () => {
  const axiosSecure = useAxiosSecure();
  const scrollRef = useRef(null);
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLeftArrowVisible, setIsLeftArrowVisible] = useState(false);

  // Fetch venue data from the backend
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axiosSecure.get("/venues");
        setVenues(response.data);
        setFilteredVenues(response.data); // Initially display all venues
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  const filterVenues = (category) => {
    if (category === "all") {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter((venue) => venue.venueType === category);
      setFilteredVenues(filtered);
    }
    setSelectedCategory(category);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.firstChild.offsetWidth + 32; // Include item width and spacing (32px gap)
      const currentScroll = scrollRef.current.scrollLeft;

      if (direction === "left") {
        const newScrollPosition = Math.max(currentScroll - itemWidth, 0);
        scrollRef.current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
      } else {
        const newScrollPosition = currentScroll + itemWidth;
        scrollRef.current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setIsLeftArrowVisible(scrollRef.current.scrollLeft > 0);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const categories = [
    { name: "All Venues", icon: "📄", value: "all" },
    { name: "Conference", icon: "🍽️", value: "conference" },
    { name: "Event Space", icon: "📰", value: "event-space" },
    { name: "Outdoor Park", icon: "🏛️", value: "outdoor-park" },
    { name: "Wedding Venue", icon: "🎉", value: "wedding-venue" },
    { name: "Studio", icon: "📸", value: "studio" },
    { name: "Banquet Hall", icon: "🏢", value: "banquet-hall" },
    { name: "Garden Venue", icon: "🌷", value: "garden-venue" },
    { name: "Beachfront Venue", icon: "🏖️", value: "beachfront-venue" },
    { name: "Private Estate", icon: "🏡", value: "private-estate" },
    { name: "Rooftop Venue", icon: "🌇", value: "rooftop-venue" },
    { name: "Exhibition Hall", icon: "🎨", value: "exhibition-hall" },
    { name: "Boardroom", icon: "💼", value: "boardroom" },
    { name: "Luxury Venue", icon: "💎", value: "luxury-venue" },
  ];

  
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950">
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
            onClick={() => scroll("left")}
            className="absolute p-12 text-gray-100 text-2xl bg-transparent focus:outline-none"
            style={{ zIndex: 1, left: "4.5rem" }}
          >
            ❮
          </button>
        )}

        {/* Venue Items Container */}
        <div ref={scrollRef} className="flex overflow-hidden space-x-8 py-4 px-4 w-full">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => filterVenues(category.value)} // Filter venues on click
              className={`flex flex-col items-center min-w-[280px] cursor-pointer ${
                selectedCategory === category.value ? "text-prime font-bold" : "text-gray-400"
              }`}
            >
              <span className="text-4xl">{category.icon}</span>
              <span className="text-lg mt-2">{category.name}</span>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 p-12 rounded-full bg-transparent text-gray-100 w-10 text-2xl"
          style={{ zIndex: 1 }}
        >
          ❯
        </button>
      </div>

      {/* VenueCard Component */}
      <div className="w-full mt-8">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => <VenueCard key={venue._id} venue={venue} />)
        ) : (
          <div className="text-center text-gray-600">No venues found for this category.</div>
        )}
      </div>
    </div>
  );
};

export default Venue;
