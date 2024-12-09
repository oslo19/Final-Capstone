import React from "react";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AddMenu = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  // Cloudinary Configuration
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/dtg6ofu1q/image/upload`;
  const uploadPreset = "unsigned_preset"; 

  const onSubmit = async (data) => {
    try {
        // Prepare the FormData object
        const formData = new FormData();
        formData.append("file", data.image[0]); // Attach the image file
        formData.append("upload_preset", uploadPreset); // Use your unsigned preset name

        // Upload the image to Cloudinary
        const response = await fetch(cloudinaryUploadUrl, {
            method: "POST",
            body: formData,
        });

        const jsonResponse = await response.json();

        if (response.ok) {
            // Prepare the menu item object with the uploaded image URL
            const menuItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                recipe: data.recipe,
                quantity: 1,
                menuTypes: data.menuTypes || [], // Handle multiple menu types (checkboxes)
                image: jsonResponse.secure_url, // Save the secure URL of the uploaded image
            };

            // Send the menu item data to your server
            await axiosSecure.post("/menu", menuItem);

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
        Upload A New <span className="text-prime">Menu Item</span>
      </h2>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Recipe Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Recipe Name*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Recipe Name"
              className="input input-bordered w-full"
            />
          </div>

          {/* Category and Price */}
          <div className="flex items-center gap-4">
            <div className="form-control w-full my-6">
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
                <option value="appetizers">APPETIZER</option>
                <option value="pork">PORK</option>
                <option value="chicken">CHICKEN</option>
                <option value="seafoods">SEAFOODS</option>
                <option value="beef">BEEF</option>
                <option value="noodles">NOODLES/PASTA</option>
                <option value="vegies">VEGIES/OTHERS</option>
                <option value="dessert">DESSERT</option>
                <option value="rice">RICE</option>
              </select>
            </div>

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

          {/* Menu Types (Multiple selection) */}
          <div className="form-control w-full my-6">
            <label className="label">
              <span className="label-text">Menu Types*</span>
            </label>
            <div className="flex gap-4">
              <label>
                <input
                  type="checkbox"
                  {...register("menuTypes")}
                  value="buffet"
                />{" "}
                Buffet
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("menuTypes")}
                  value="packed meals"
                />{" "}
                Packed Meals
              </label>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Details</span>
            </label>
            <textarea
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the world about your recipe"
            ></textarea>
          </div>

          {/* Image Upload */}
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

export default AddMenu;
