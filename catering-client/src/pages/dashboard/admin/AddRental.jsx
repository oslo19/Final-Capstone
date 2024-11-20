import React from "react";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddRental = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();

  // Cloudinary Configuration
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/dtg6ofu1q/image/upload`;
  const uploadPreset = "unsigned_preset"; 

  const onSubmit = async (data) => {
    try {
        // Prepare the FormData object
        const formData = new FormData();
        formData.append("file", data.image[0]); // Attach the image file
        formData.append("upload_preset", "unsigned_preset"); // Use your unsigned preset name

        // Upload the image to Cloudinary
        const response = await fetch("https://api.cloudinary.com/v1_1/dtg6ofu1q/image/upload", {
            method: "POST",
            body: formData,
        });

        const jsonResponse = await response.json();

        if (response.ok) {
            // Prepare the rental item object with the uploaded image URL
            const rentalItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                recipe: data.recipe,
                quantity: 1,
                image: jsonResponse.secure_url, // Save the secure URL of the uploaded image
            };

            // Send the rental item data to your server
            await axiosSecure.post("/rental", rentalItem);

            // Reset the form and show a success message
            reset();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your item has been added successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            throw new Error(jsonResponse.error.message || "Image upload failed.");
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Image upload failed. Please try again.",
        });
    }
};



  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-white">
        Upload A New <span className="text-prime">Rental Item</span>
      </h2>

      {/* Form */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Rental Name*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Rental Name"
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex items-center gap-4 my-6">
            {/* Category */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>
              <select
                {...register("category", { required: true })}
                className="select select-bordered"
                defaultValue="default"
              >
                <option disabled value="default">
                  Select a category
                </option>
                <option value="tent">Tent</option>
                <option value="tables">Tables</option>
                <option value="seating">Seating</option>
                <option value="linen">Linen & Napkins</option>
                <option value="bars">Bars</option>
                <option value="glassware">Glassware</option>
                <option value="plates">Plates & Chargers</option>
                <option value="flatware">Flatware</option>
                <option value="dessert">Dessert & Cake Stands</option>
                <option value="servingtrays">Serving Trays & Bowls</option>
                <option value="foodservice">Food Service</option>
                <option value="coolers">Coolers & Beverage Dispensers</option>
                <option value="buffet">Buffet Setup</option>
                <option value="centerpiece">Centerpieces</option>
              </select>
            </div>

            {/* Price */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                placeholder="Price"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Rental Details</span>
            </label>
            <textarea
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the world about your rental"
            ></textarea>
          </div>

          <div className="form-control w-full my-6">
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input w-full max-w-xs"
            />
          </div>

          <button className="btn bg-prime text-white px-6">
            Add Item <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRental;
