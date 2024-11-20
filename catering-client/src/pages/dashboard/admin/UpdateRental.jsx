import React from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUtensils } from 'react-icons/fa';
import useMenu from '../../../hooks/useRental';

const UpdateRental = () => {
  const [rental, , refetch] = useMenu();
    const item = useLoaderData();
    console.log(item);
    const { register, handleSubmit, reset } = useForm();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate()
  
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
          // Prepare the rental item object with the uploaded image URL
          const rentalItem = {
            name: data.name,
            category: data.category,
            price: parseFloat(data.price),
            recipe: data.recipe,
            image: jsonResponse.secure_url, // Save the secure URL of the uploaded image
          };
    
          // Send the rental item data to your server
          const updateResponse = await axiosSecure.patch(`/rental/${item._id}`, rentalItem);
    
          if (updateResponse.status === 200) {
            reset();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your item updated successfully!",
              showConfirmButton: false,
              timer: 1500,
            });
    
            navigate("/dashboard/manage-rentals");
            refetch();
          }
        } else {
          throw new Error(jsonResponse.error.message || "Image upload failed.");
        }
      } catch (error) {
        console.error("Error updating rental item:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again.",
        });
      }
    };
    
  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Update This <span className="text-prime">Rental Item</span>
      </h2>

      {/* form here */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Recipe Name*</span>
            </label>
            <input
              type="text"
              defaultValue={item.name}
              {...register("name", { required: true })}
              placeholder="Recipe Name"
              className="input input-bordered w-full "
            />
          </div>

          {/* 2nd row */}
          <div className="flex items-center gap-4">
            {/* categories */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>
              <select
                {...register("category", { required: true })}
                className="select select-bordered"
                defaultValue={item.category}
              >
                <option disabled value="default">
                  Select a category
                </option>
                <option value="tent">Tent</option>
                  <option value="tables">Tables</option>
                  <option value="seating">Seating</option>
                  <option value="linean">Linean & Napkins</option>
                  <option value="bars">Bars</option>
                  <option value="glassware">Glassware</option>
                  <option value="plates">Plates & Chargers</option>
                  <option value="flatware">Flatware</option>
                  <option value="servingtrays">Serving Trays & Bowls</option>
                  <option value="foodservice">Food Service</option>
                  <option value="coolers">Coolers & Beverage Dispensers</option>
              </select>
            </div>

            {/* prices */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                defaultValue={item.price}
                {...register("price", { required: true })}
                placeholder="Price"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* 3rd row */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Details</span>
            </label>
            <textarea
             defaultValue={item.recipe}
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the worlds about your recipe"
            ></textarea>
          </div>

          {/* 4th row */}
          <div className="form-control w-full my-6">
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input w-full max-w-xs"
            />
          </div>

          <button className="btn bg-prime text-white px-6">
            Update Item <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateRental