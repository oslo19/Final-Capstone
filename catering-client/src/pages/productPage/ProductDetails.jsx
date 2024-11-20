import React, { useContext, useEffect, useState } from "react";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../contexts/AuthProvider";
import axios from "axios";
import useProduct from "../../hooks/useProduct";

const ProductDetails = ({ item }) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [product, loading, refetch] = useProduct(id);
  const [productItems, setProductItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const resetQuantity = async () => {
      // Ensure that product._id exists before making the API call
      if (product && product._id) {
        try {
          await fetch(
            `http://localhost:6001/menu/reset-quantity/${product._id}`,
            {
              method: "PATCH",
            }
          );
        } catch (error) {
          console.error("Failed to reset quantity:", error);
        }
      } else {
        console.error("Product or product._id is undefined");
      }
    };

    // Only call resetQuantity if data has been fetched and product is available
    if (!loading && product && product._id) {
      resetQuantity();
    }
  }, [loading, product]);

  const handleIncrease = async (item) => {
    if (isLoading) return; // Prevent multiple clicks during the request
    setIsLoading(true); // Disable button during the update

    // Update the local quantity first
    const updatedProduct = productItems.map((productItem) => {
      if (productItem.id === item.id) {
        return { ...productItem, quantity: productItem.quantity + 1 };
      }
      return productItem;
    });
    setProductItems(updatedProduct);

    try {
      const response = await fetch(
        `http://localhost:6001/menu/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: product.quantity + 1 }),
        }
      );

      if (response.ok) {
        await refetch(); // Fetch updated data from server
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  const handleDecrease = async (item) => {
    if (isLoading || product.quantity <= 1) return; // Prevent multiple clicks or decrease below 1
    setIsLoading(true); // Disable button during the update

    // Update the local quantity first
    const updatedProduct = productItems.map((productItem) => {
      if (productItem.id === item.id) {
        return { ...productItem, quantity: productItem.quantity - 1 };
      }
      return productItem;
    });
    setProductItems(updatedProduct);

    try {
      const response = await fetch(
        `http://localhost:6001/menu/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: product.quantity - 1 }),
        }
      );

      if (response.ok) {
        await refetch(); // Fetch updated data from server
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  const handleAddToCart = (item) => {
    if (user && user.email) {
      const cartItem = {
        email: user.email,
        menuItemId: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
      };

      axios
        .post("http://localhost:6001/carts", cartItem)
        .then((response) => {
          console.log(response);
          if (response) {
            refetch(); // refetch cart
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Food added on the cart.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
          const errorMessage = error.response.data.message;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: `${errorMessage}`,
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

  const handleInputChange = async (value) => {
    const newQuantity = parseInt(value, 10);
    // Validate input to ensure it is a positive number
    if (isNaN(newQuantity) || newQuantity < 1) return;
    try {
      const response = await fetch(
        `http://localhost:6001/menu/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        await refetch(); // Fetch updated data from the server
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Backspace") {
      let newQuantity = product.quantity.toString();
      if (newQuantity.length > 1) {
        newQuantity = newQuantity.slice(0, -1); // Remove the last digit
      } else {
        newQuantity = "1"; // Reset to 1 if it's a single digit
      }

      await handleInputChange(newQuantity); // Update quantity in the backend
    }
  };

  return (
    <div>
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
        <div className="py-48 flex flex-col items-center justify-center">
          {/* content */}
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug text-white">
              For the Love of Delicious <span className="text-prime">Food</span>
            </h2>
            <p className="text-white text-xl md:w-4/5 mx-auto">
              Come with family & feel the joy of mouthwatering food such as
              Greek Salad, Lasagne, Butternut Pumpkin, Tokusen Wagyu, Olivas
              Rellenas and more for a moderate cost
            </p>
          </div>
        </div>
      </div>

      {/* product section */}
      <div className="section-container">
        <div className="font-sans tracking-wide max-md:mx-auto">
          <div className="bg-gradient-to-r from-gray-600 via-gray-900 to-gray-900 md:min-h-[300px] grid items-start grid-cols-1 lg:grid-cols-5 md:grid-cols-2">
            <div className="lg:col-span-3 h-full p-8">
              <div className="relative h-full flex items-center justify-center lg:min-h-[400px]">
                <img
                  src={product.image}
                  alt="Product"
                  className="lg:w-3/5 w-3/4 h-full object-contain max-lg:p-8"
                />

                <div className="flex space-x-4 items-end absolute right-0 max-md:right-4 md:bottom-4 bottom-0"></div>
              </div>
            </div>
            <div className="lg:col-span-2 bg-gray-100 py-6 px-8 h-full mt-">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {product.name}
                </h2>

                <div className="flex space-x-1 mt-2">
                  <svg
                    className="w-4 fill-orange-500"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <svg
                    className="w-4 fill-orange-500"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <svg
                    className="w-4 fill-orange-500"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <svg
                    className="w-4 fill-orange-500"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <svg
                    className="w-4 fill-[#CED5D8]"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                </div>
              </div>

              <div className="my-9">
                <h3 className="text-lg font-bold text-gray-800">Price</h3>
                <p className="text-gray-800 text-3xl font-bold mt-4">
                  ₱{(product.price * product.quantity).toFixed(2)}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800">Quantity</h3>
                <div className="flex divide-x border w-max mt-4 rounded overflow-hidden">
                  {/* Decrease Button */}
                  <button
                    onClick={() => handleDecrease()}
                    disabled={isLoading || product.quantity <= 1}
                    type="button"
                    className="bg-gray-100 w-10 h-9 font-semibold flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 fill-current inline"
                      viewBox="0 0 124 124"
                    >
                      <path
                        d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </button>

                  {/* Quantity Input */}
                  <input
                    type="text" // Change type to "text" to better handle string manipulation
                    value={product.quantity}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="bg-transparent w-14 h-9 text-center font-semibold text-gray-800 text-lg"
                    min="1"
                  />

                  {/* Increase Button */}
                  <button
                    onClick={() => handleIncrease()}
                    disabled={isLoading}
                    type="button"
                    className="bg-gray-800 text-white w-10 h-9 font-semibold flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 fill-current inline"
                      viewBox="0 0 42 42"
                    >
                      <path
                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 my-16">
                <button
                  type="button"
                  className="min-w-[200px] px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded"
                >
                  Buy now
                </button>
                <button
                  onClick={() => handleAddToCart()}
                  type="button"
                  className="min-w-[200px] px-4 py-2.5 border border-orange-500 bg-transparent hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded"
                >
                  Add to cart
                </button>
              </div>

              <div className="flex flex-wrap items-center text-sm text-gray-800 mt-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current w-6 mr-3"
                  viewBox="0 0 48 48"
                >
                  <path d="M15.5 33.3h19.1v2H15.5z" data-original="#000000" />
                  <path
                    d="M45.2 35.3H43v-2h2.2c.4 0 .8-.4.8-.8v-9.1c0-.4-.3-.6-.5-.7l-3.2-1.3c-.3-.2-.8-.5-1.1-1l-6.5-10c-.1-.2-.4-.3-.7-.3H2.8c-.4 0-.8.4-.8.8v21.6c0 .4.4.8.8.8h3.9v2H2.8C1.3 35.3 0 34 0 32.5V10.9c0-1.5 1.3-2.8 2.8-2.8h31.3c1 0 1.9.5 2.4 1.3l6.5 10 .4.4 2.9 1.2c1.1.5 1.7 1.4 1.7 2.5v9.1c0 1.4-1.3 2.7-2.8 2.7z"
                    data-original="#000000"
                  />
                  <path
                    d="M26.5 21H3.9v-9.4h22.6zM5.9 19h18.6v-5.4H5.9zm32.9 2H27.9v-9.4h6.3zm-8.9-2h5.7L33 13.6h-3.1zm-19 20.9c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6zm0-9.2c-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6-1.6-3.6-3.6-3.6zm27.9 9.2c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6zm0-9.2c-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6-1.6-3.6-3.6-3.6z"
                    data-original="#000000"
                  />
                </svg>
                Free delivery on order
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-2xl px-6">
            <div className="mt-8">
              <h3 className="text-lg font-bold text-white">
                Product Description
              </h3>
              <p className="text-sm text-white mt-4">{product.recipe}</p>
            </div>
          </div>
        </div>
      </div>

      {/* display reviews section */}
      <section></section>
    </div>
  );
};

export default ProductDetails;
