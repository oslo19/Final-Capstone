import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Swal from 'sweetalert2';

const AddPackage = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  // Fetch all menu items for selection
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axiosPublic.get("/menu");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Auto-generate a package
  const generatePackage = () => {
    // Define package criteria
    const packageCriteria = {
      mainDishes: 3,
      dessertOrAppetizer: 1,
      rice: 2,
      drinks: 1,
    };

    // Filter items by category
    const mainDishes = menuItems.filter(item => item.category === "pork" || item.category === "chicken" || item.category === "beef");
    const dessertOrAppetizers = menuItems.filter(item => item.category === "dessert" || item.category === "appetizers");
    const riceItems = menuItems.filter(item => item.category === "rice");
    const drinks = menuItems.filter(item => item.category === "drinks");

    // Helper to select items based on criteria
    const selectItems = (items, count) => items.slice(0, count).map(item => item._id);

    // Select items based on criteria
    const selectedMainDishes = selectItems(mainDishes, packageCriteria.mainDishes);
    const selectedDessertsOrAppetizers = selectItems(dessertOrAppetizers, packageCriteria.dessertOrAppetizer);
    const selectedRiceItems = selectItems(riceItems, packageCriteria.rice);
    const selectedDrinks = selectItems(drinks, packageCriteria.drinks);

    // Combine all selected items and remove duplicates
    const generatedItems = [...selectedMainDishes, ...selectedDessertsOrAppetizers, ...selectedRiceItems, ...selectedDrinks];

    // Calculate total price
    const selectedMenuItems = menuItems.filter(item => generatedItems.includes(item._id));
    const generatedPrice = selectedMenuItems.reduce((total, item) => total + item.price, 0);

    // Update state with selected items and total price
    setSelectedItems(generatedItems);
    setTotalPrice(generatedPrice);
    setValue("price", generatedPrice);  // Update form with generated price
  };

  // Handle package form submission
  const onSubmit = async (data) => {
    const packageData = {
      name: data.name || "Auto-Generated Package",
      description: data.description || "This is an auto-generated package based on selected criteria.",
      price: totalPrice,
      items: selectedItems,  // Array of selected menu item IDs
    };

    try {
      await axiosSecure.post('/packages', packageData);
      reset();
      setSelectedItems([]);
      setTotalPrice(0);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Package created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Failed to create package:", error);
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-white">
        Create a <span className="text-prime">Food Package</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Package Name*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Package Name"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full my-4">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            {...register("description")}
            className="textarea textarea-bordered h-24"
            placeholder="Package description"
          ></textarea>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Price*</span>
          </label>
          <input
            type="number"
            {...register("price")}
            value={totalPrice}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="button"
          onClick={generatePackage}
          className="btn bg-blue-500 text-white mt-4"
        >
          Generate Package
        </button>

        <button className="btn bg-prime text-white px-6 mt-4">
          Create Package
        </button>
      </form>

      <h3 className="my-4">Selected Items:</h3>
      <ul>
        {selectedItems.map((itemId) => {
          const item = menuItems.find(i => i._id === itemId);
          return <li key={itemId}>{item?.name} - ₱{item?.price}</li>;
        })}
      </ul>
      <p className="mt-2 text-lg font-semibold">Total Price: ₱{totalPrice}</p>
    </div>
  );
};

export default AddPackage;
