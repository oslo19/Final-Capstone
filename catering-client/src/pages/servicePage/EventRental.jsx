import React, { useEffect, useState } from "react";
import RentalCards from "../../components/RentalCards"; // Adjust path as needed

const EventRental = () => {
  const [rental, setRental] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Number of items to display per page

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:6001/rental");
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
    <section className="max-w-auto mx-auto bg-gradient-to-r from-gray-900 via-gray-900  border-gray-200 rounded-lg shadow">
      {/* Container */}
      <div className="mx-auto w-full px-5 py-16 md:px-10 md:py-24 text-white hover:text-orange">
        {/* Component */}
        <div className="flex flex-col gap-12">
          {/* Title */}
          <div className="flex flex-col gap-5 mt-32">
            <h3 className="text-2xl font-bold md:text-5xl">Search Amenities</h3>
          </div>
          {/* Content */}
          <div className="grid gap-10 md:gap-12 lg:grid-cols-[max-content_1fr]">
            {/* Filters */}
            <div className="mb-4 max-w-none lg:w-full mr-9">
              <form
                name="wf-form-Filter-2"
                method="get"
                className="flex-col gap-6"
              >
                {/* Search input */}
                <input
                  type="text"
                  value={searchTerm} // Controlled input
                  onChange={handleSearch} // Handle search on change
                  className="mb-10 block h-9 min-h-[44px] w-full rounded-md border border-solid border-[#cccccc] bg-[#f2f2f7] bg-[16px_center] bg-no-repeat py-3 pl-11 pr-4 text-sm font-bold text-[#333333] [background-size:18px] [border-bottom:1px_solid_rgb(215,_215,_221)]"
                  placeholder="Search"
                  style={{
                    backgroundImage:
                      'url("https://assets.website-files.com/6458c625291a94a195e6cf3a/64b7a3a33cd5dc368f46daaa_MagnifyingGlass.svg")',
                  }}
                />
                {/* Categories */}
                <div className="flex flex-col gap-6 ">
                  <p className="font-semibold">Categories</p>
                  <div className="flex flex-col items-start w-full bg-white rounded-lg border border-gray-600 shadow-md font-bold">
                    <a
                      href="#"
                      onClick={showAll}
                      className={`${
                        selectedCategory === "all"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        All Categories
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("tent")}
                      className={`${
                        selectedCategory === "tent"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Tent - Canopy Pro Install
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("tables")}
                      className={`${
                        selectedCategory === "tables"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">Tables</p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("seating")}
                      className={`${
                        selectedCategory === "seating"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Seating
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("linean")}
                      className={`${
                        selectedCategory === "linean"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Linen & Napkins
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("bars")}
                      className={`${
                        selectedCategory === "bars"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">Bars</p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("glassware")}
                      className={`${
                        selectedCategory === "glassware"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                      >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Glassware
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("plates")}
                      className={`${
                        selectedCategory === "plates"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Plates & Chargers
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("flatware")}
                      className={`${
                        selectedCategory === "flatware"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Flatware
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("dessert")}
                      className={`${
                        selectedCategory === "dessert"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Dessert & Cake Stands
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("servingtrays")}
                      className={`${
                        selectedCategory === "servingtrays"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Serving Trays & Bowls
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("foodservice")}
                      className={`${
                        selectedCategory === "foodservice"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full border-b border-gray-400 p-3 hover:bg-gray-50`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Food Service
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("coolers")}
                      className={`${
                        selectedCategory === "coolers"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full p-3 hover:bg-gray-400`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Coolers & Beverage Dispensers
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("buffet")}
                      className={`${
                        selectedCategory === "buffet"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full p-3 hover:bg-gray-400`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                        Buffet Setup
                      </p>
                    </a>
                    <a
                      href="#"
                      onClick={() => filterItems("centerpiece")}
                      className={`${
                        selectedCategory === "centerpiece"
                          ? "bg-gray-100 font-semibold"
                          : ""
                      } w-full p-3 hover:bg-gray-400`}
                    >
                      <p className="cursor-pointer w-full text-black hover:text-prime">
                      Centerpieces
                      </p>
                    </a>
                  </div>
                </div>
              </form>
            </div>

            {/* Decor */}
            <div className="w-full">
              {/* Pagination */}
              <div className="flex justify-center my-8 flex-wrap gap-1">
                {Array.from({
                  length: Math.ceil(filteredItems.length / itemsPerPage),
                }).map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-3 py-1 rounded-full ${
                      currentPage === index + 1
                        ? "bg-prime text-white"
                        : "bg-gray-200 hover:bg-prime"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Rental card */}
              <div className="flex flex-wrap w-auto h-auto">
                {currentItems.map((item, index) => (
                  <RentalCards key={index} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventRental;
