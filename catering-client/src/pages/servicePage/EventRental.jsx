import React, { useEffect, useState } from "react";
import RentalCards from "../../components/RentalCards"; // Adjust path as needed

const EventRental = () => {
  const [rental, setRental] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Number of items to display per page

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/rental`);
        const data = await response.json();
        setRental(data);
        setFilteredItems(data); // Initially, display all items
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filterItems = (category) => {
    const filtered =
      category === "all"
        ? rental
        : rental.filter((item) => item.category === category);

    setFilteredItems(filtered);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const showAll = () => {
    setFilteredItems(rental);
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  // Function to handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = rental.filter(
      (item) =>
        item.name.toLowerCase().includes(value) || // Adjust 'name' field to match your data structure
        item.category.toLowerCase().includes(value)
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="w-full  text-white">
      {/* Container */}
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Component */}

        {/* Title */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold md:text-5xl">Search Amenities</h3>
        </div>
        {/* Content */}
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[max-content_1fr]">
          {/* Filters */}
          <div className="w-full max-w-xs lg:max-w-sm">
            <form
              name="wf-form-Filter-2"
              method="get"
              className="flex flex-col gap-6"
            >
              {/* Search input */}
              <input
                type="text"
                value={searchTerm} // Controlled input
                onChange={handleSearch} // Handle search on change
                className="block w-full h-12 px-4 pl-12 rounded-md border border-gray-300 bg-[#f2f2f7] text-sm font-medium text-gray-700 placeholder-gray-400"
                placeholder="Search"
                style={{
                  backgroundImage:
                    'url("https://assets.website-files.com/6458c625291a94a195e6cf3a/64b7a3a33cd5dc368f46daaa_MagnifyingGlass.svg")',
                  backgroundSize: "16px",
                  backgroundPosition: "12px center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              {/* Categories */}
              <div className="flex flex-col gap-4">
                <p className="font-semibold">Categories</p>
                <div className="bg-white rounded-lg shadow-md border border-gray-300">
                  {[
                    { label: "All Categories", value: "all" },
                    { label: "Tent - Canopy Pro Install", value: "tent" },
                    { label: "Tables", value: "tables" },
                    { label: "Seating", value: "seating" },
                    { label: "Linen & Napkins", value: "linean" },
                    { label: "Bars", value: "bars" },
                    { label: "Glassware", value: "glassware" },
                    { label: "Plates & Chargers", value: "plates" },
                    { label: "Flatware", value: "flatware" },
                    { label: "Dessert & Cake Stands", value: "dessert" },
                    { label: "Serving Trays & Bowls", value: "servingtrays" },
                    { label: "Food Service", value: "foodservice" },
                    {
                      label: "Coolers & Beverage Dispensers",
                      value: "coolers",
                    },
                    { label: "Buffet Setup", value: "buffet" },
                    { label: "Centerpieces", value: "centerpiece" },
                  ].map(({ label, value }) => (
                    <a
                      key={value}
                      href="#"
                      onClick={() => filterItems(value)}
                      className={`block w-full px-4 py-2 border-b border-gray-300 ${
                        selectedCategory === value
                          ? "bg-gray-100 font-bold"
                          : ""
                      } hover:bg-gray-50 text-gray-800`}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Decor */}
          <div className="w-full">
            {/* Pagination */}
           
            {/* Rental card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((item, index) => (
                <RentalCards key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 mb-16 gap-2">
    {Array.from({
      length: Math.ceil(filteredItems.length / itemsPerPage),
    }).map((_, index) => (
      <button
        key={index}
        onClick={() => paginate(index + 1)}
        className={`px-4 py-2 rounded-full ${
          currentPage === index + 1
            ? "bg-prime text-white"
            : "bg-gray-300 text-gray-700 hover:bg-prime hover:text-white"
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
    </section>
  );
};

export default EventRental;
