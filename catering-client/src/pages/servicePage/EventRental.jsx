import React, { useEffect, useState } from 'react'
import Cards from '../../components/Cards'
import RentalCards from '../../components/RentalCards';
import { Link } from 'react-router-dom';


const EventRental = () => {
  const [rental, setRental] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
 
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



  //   console.log(filteredItems);
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className='mx-64 bg-gradient-to-r from-gray-900 via-gray-900  border-gray-200 rounded-lg shadow'>
      {/* Container */}
      <div className="mx-auto w-full px-5 py-16 md:px-10 md:py-24 text-white hover:text-orange">
        {/* Component */}
        <div className="flex flex-col gap-12">
          {/* Title */}
          <div className="flex flex-col gap-5 mt-32">
            <h3 className="text-2xl font-bold md:text-5xl">Filter products</h3>
          </div>
          {/* Content */}
          <div className="grid gap-10 md:gap-12 lg:grid-cols-[max-content_1fr]">
            {/* Filters */}
            <div className="mb-4 max-w-none lg:max-w-sm mr-9">
              <form name="wf-form-Filter-2" method="get" className="flex-col gap-6">
                {/* Filters title */}
                <div className="mb-6 flex items-center justify-between py-4 [border-bottom:1px_solid_rgb(217,_217,_217)]">
                  <h5 className="text-xl font-bold">Filters</h5>
                  <a href="#" className="text-sm hover:text-prime">
                    <p>Clear all</p>
                  </a>
                </div>
                {/* Search input */}
                <input type="text" className="mb-10 block h-9 min-h-[44px] w-full rounded-md border border-solid border-[#cccccc] bg-[#f2f2f7] bg-[16px_center] bg-no-repeat py-3 pl-11 pr-4 text-sm font-bold text-[#333333] [background-size:18px] [border-bottom:1px_solid_rgb(215,_215,_221)]" placeholder="Search" style={{ backgroundImage: 'url("https://assets.website-files.com/6458c625291a94a195e6cf3a/64b7a3a33cd5dc368f46daaa_MagnifyingGlass.svg")' }} />
                {/* Categories */}
                <div className="flex flex-col gap-6 ">
                  <p className="font-semibold">Categories</p>
                  <div className="flex flex-wrap items-center gap-2 categories">
                    <a 
                    href="#" 
                    onClick={showAll}
                    className={selectedCategory === "all" ? "activerental" : ""}>
                      <p className='cursor-pointer'>All Categories</p>
                    </a>
                    <a 
                    href="#" 
                    onClick={() => filterItems("tent")}
                    className={selectedCategory === "tent" ? "activerental" : ""}>
                      <p className='cursor-pointer '>Tent</p>
                    </a>
                    <a 
                    href="#" 
                    onClick={() => filterItems("tables")}
                    className={selectedCategory === "tables" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Tables</p>
                    </a>
                    <a 
                    href="#" 
                    onClick={() => filterItems("seating")}
                    className={selectedCategory === "seating" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Seating</p>
                    </a>
                    <a 
                    href="#" 
                    onClick={() => filterItems("linean")}
                    className={selectedCategory === "linean" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Linean & Napkins</p>
                    </a>
                    <a 
                    href="#" 
                    onClick={() => filterItems("bars")}
                    className={selectedCategory === "bars" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Bars</p>
                    </a>
                    <a 
                    href="#" 
                    onClick={() => filterItems("glassware")}
                    className={selectedCategory === "glassware" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Glassware</p>
                    </a>
                    <a 
                     onClick={() => filterItems("plates")}
                     className={selectedCategory === "plates" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Plates & Chargers</p>
                    </a>
                    <a 
                    onClick={() => filterItems("flatware")}
                    className={selectedCategory === "flatware" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Flatware</p>
                    </a>
                    <a 
                     onClick={() => filterItems("dessert")}
                     className={selectedCategory === "dessert" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Dessert & Cake Stands</p>
                    </a>
                    <a 
                     onClick={() => filterItems("servingtrays")}
                     className={selectedCategory === "servingtrays" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Serving Trays & Bowls</p>
                    </a>
                    <a 
                    href="#" 
                    onClick={() => filterItems("foodservice")}
                    className={selectedCategory === "foodservice" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Food Service</p>
                    </a>
                    <a 
                    onClick={() => filterItems("coolers")}
                    className={selectedCategory === "coolers" ? "activerental" : ""}>
                      <p className='cursor-pointer'>Coolers & Beverage Dispensers</p>
                    </a>

                  </div>
                </div>
                {/* Divider */}
                <div className="mb-6 mt-6 h-px w-full bg-[#d9d9d9]"></div>
                {/* Rating */}
                <div className="flex flex-col gap-10">
                  <p className="font-semibold">Rating</p>
                  <div className="flex flex-wrap gap-2 lg:justify-between text-black">
                    <div className="flex h-9 w-14 cursor-pointer items-center justify-center rounded-md border border-solid border-[#cccccc] bg-[#f2f2f7] text-sm font-semibold">
                      <span>1</span>
                    </div>
                    <div className="flex h-9 w-14 cursor-pointer items-center justify-center rounded-md border border-solid border-[#cccccc] bg-black text-sm font-semibold text-white">
                      <span>2</span>
                    </div>
                    <div className="flex h-9 w-14 cursor-pointer items-center justify-center rounded-md border border-solid border-[#cccccc] bg-[#f2f2f7] text-sm font-semibold">
                      <span>3</span>
                    </div>
                    <div className="flex h-9 w-14 cursor-pointer items-center justify-center rounded-md border border-solid border-[#cccccc] bg-[#f2f2f7] text-sm font-semibold">
                      <span>4</span>
                    </div>
                    <div className="flex h-9 w-14 cursor-pointer items-center justify-center rounded-md border border-solid border-[#cccccc] bg-[#f2f2f7] text-sm font-semibold">
                      <span>5</span>
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <div className="mb-6 mt-6 h-px w-full bg-[#d9d9d9]"></div>
              
              </form>
            </div>
            {/* Decor */}
            <div className="w-full">
              {/* Pagination */}
              <div className="flex justify-center my-8 flex-wrap gap-1">
                {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-3 py-1 rounded-full ${currentPage === index + 1 ? "bg-prime text-white" : "bg-gray-200 hover:bg-prime"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

                 {/* Rental card */}
             
              <div className="flex flex-wrap ">
                {currentItems.map((item, index) => (
                  <RentalCards key={index} item={item} />
                ))}
              </div>
        
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default EventRental