import React, { useContext, useEffect, useState } from "react";
import CartPopover from "./CartPopover";
import { AuthContext } from "../contexts/AuthProvider";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import useBookingCart from "../hooks/useBookingCart";
import usePackage from "../hooks/usePackage"; // Import the hook for fetching packages

const MenuModal = ({
  showMenuModal,
  handleMenuToggleModal,
  menuItems,
  selectedMenuType,
  numberOfPax
}) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [isCartPopoverVisible, setCartPopoverVisible] = useState(false);
  const [bookingCart, refetch] = useBookingCart();
  const [maxBudget, setMaxBudget] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [view, setView] = useState("custom");
  const [generatedMenu, setGeneratedMenu] = useState(null);

  // Fetch available packages
  const [packages, loading] = usePackage();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!showMenuModal) {
      setSelectedCategory("all");
    }
  }, [showMenuModal]);

  useEffect(() => {
    if (showMenuModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showMenuModal]);

  const filterItems = (category) => {
    let filtered = menuItems;
    
    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by budget
    filtered = filtered.filter((item) => item.price <= maxBudget);
    
    setFilteredItems(filtered);
  };

  useEffect(() => {
    filterItems(selectedCategory);
  }, [selectedCategory, menuItems, maxBudget]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddToCart = (item) => {
    const newTotal = orderTotal + item.price;
    
    if (newTotal > maxBudget) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: `Adding this item would exceed your budget of ₱${maxBudget}.`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
  
    if (user && user.email) {
      const bookingItem = {
        email: user.email,
        bookingItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      };
  
      axios
        .post(`${BASE_URL}/booking-cart`, bookingItem)
        .then((response) => {
          if (response) {
            refetch();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Food added to the cart.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: error.response?.data?.message || "An error occurred",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: "Please login to order the food",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  const cartSubtotal = bookingCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const orderTotal = cartSubtotal;

  const toggleCartPopover = () => {
    setCartPopoverVisible((prev) => !prev);
  };

  const handleConfirm = () => {
    onConfirm(bookingCart); // Pass bookingCart data to parent
    handleMenuToggleModal(); // Close the modal
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Function to generate a menu based on the user's budget and number of pax
  const generateMenu = () => {
    const totalPax = numberOfPax; // Get number of pax from props
    const userBudget = maxBudget;

    if (packages && packages.length > 0) {
      // Find the suitable package based on pax and budget
      const suitablePackage = packages.find((pkg) => {
        const paxPerPackage = pkg.pax || 10; // Assume each package is for 10 pax
        const packageCost = pkg.price * Math.ceil(totalPax / paxPerPackage); // Calculate cost based on number of pax
        return packageCost <= userBudget; // Check if the cost fits the budget
      });

      if (suitablePackage) {
        // Calculate the total cost for the number of pax
        const paxPerPackage = suitablePackage.pax || 10; // Default to 10 pax per package
        const totalPrice = suitablePackage.price * Math.ceil(totalPax / paxPerPackage); // Multiply by the number of packages required

        setGeneratedMenu({
          ...suitablePackage,
          totalPrice,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "No suitable package found within your budget",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const handleAddPackageToCart = () => {
    const packageItem = {
      email: user.email,
      bookingItemId: generatedMenu._id,
      name: generatedMenu.name,
      price: generatedMenu.totalPrice,
      quantity: 1,
      image: generatedMenu.image,
    };

    if (user && user.email) {
      axios
        .post(`${BASE_URL}/booking-cart`, packageItem)
        .then((response) => {
          if (response) {
            refetch();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Package added to the cart.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: error.response?.data?.message || "An error occurred",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: "Please login to add the package to the cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  if (!showMenuModal) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black bg-opacity-75">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] h-[90%] max-h-[90vh] m-4 overflow-hidden z-[1050] mt-9 flex flex-col">
        <h3 className="text-2xl leading-6 font-medium text-gray-900 text-center py-4 border-b border-gray-200">
          Menu Order
        </h3>
        
        {/* Budget Input */}
        <div className="flex flex-wrap justify-between px-4 py-4 border-b border-gray-200 gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="max-budget" className="block text-sm font-medium text-gray-700 mt-2">Enter your Budget</label>
            <input
              type="number"
              id="max-budget"
              className="w-full p-1 border rounded-md text-sm text-gray-700"
              min="0"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
            />
          </div>

          {/* Filter Section */}
          <div className="w-full md:w-1/3">
            <select className="select w-full max-w-xs" onChange={handleCategoryChange}>
              <option value="all">All</option>
              <option value="appetizers">Appetizer</option>
              <option value="pork">Pork</option>
              <option value="chicken">Chicken</option>
              <option value="seafoods">Seafoods</option>
              <option value="beef">Beef</option>
              <option value="noodles">Noodles/Pasta</option>
              <option value="vegies">Vegies/Others</option>
              <option value="dessert">Dessert</option>
              <option value="rice">Rice</option>
            </select>
          </div>
        </div>

        {/* Generate Menu Button */}
        <div className="text-center mt-4">
          <button
            onClick={generateMenu}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg"
          >
            Generate Menu
          </button>
        </div>

        {/* Display Generated Menu */}
        {generatedMenu && (
          <div className="p-6 mt-4 bg-gray-100 rounded-lg">
            <h4 className="text-xl font-semibold">Recommended Package</h4>
            <p>{generatedMenu.name}</p>
            <p>For {numberOfPax} pax</p>
            <p>Price: ₱{generatedMenu.totalPrice}</p>
            {/* Display description */}
            <p className="mt-2 text-sm text-gray-600">{generatedMenu.description}</p>
            <button
              onClick={handleAddPackageToCart}
              className="px-6 py-2 text-white bg-green-600 rounded-lg mt-4"
            >
              Add Package to Cart
            </button>
          </div>
        )}

        {/* Menu Items */}
        <div className="prose p-6 overflow-y-auto" style={{ maxHeight: "50vh" }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div key={index} className="relative m-4 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border bg-white shadow-md">
                <a className="relative mx-3 mt-3 h-60 overflow-hidden rounded-xl flex justify-center" href="#">
                  <img className="object-cover" src={item.image} alt="product" />
                </a>
                <div className="mt-4 px-5 pb-5">
                  <h5 className="text-xl text-slate-900">{item.name}</h5>
                  <p className="text-3xl font-bold text-slate-900">₱{item.price}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between fixed bottom-0 left-0 w-full lg:w-full mx-auto border-t border-gray-200 z-[1050]">
          <label
            tabIndex={0}
            onClick={toggleCartPopover}
            className="btn btn-ghost btn-circle  lg:flex items-center justify-center mr-3"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">
                {bookingCart.length || 0}
              </span>
            </div>
          </label>

          <dl className="flex items-center justify-between gap-4 pt-2">
            <dt className="text-xl font-bold text-gray-900 dark:text-white">
              Total ({bookingCart.length} item)
            </dt>
            <dd className="text-2xl font-bold text-gray-900 dark:text-white">
              ₱{orderTotal.toFixed(2)}
            </dd>
          </dl>

          {/* CartPopover */}
          <CartPopover isVisible={isCartPopoverVisible} />

          {/* Confirm Button */}
          <button
            onClick={handleMenuToggleModal}
            type="button"
            className="inline-flex justify-center rounded-md border shadow-sm px-4 py-3 bg-black text-white font-medium text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
