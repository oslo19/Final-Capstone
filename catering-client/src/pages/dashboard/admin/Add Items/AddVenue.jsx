import React from "react";
import { FaBuilding } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AddVenue = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Cloudinary Configuration
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/dtg6ofu1q/image/upload`;
  const uploadPreset = "unsigned_preset"; 

  const onSubmit = async (data) => {
    try {
        const uploadedImages = [];
        const imageFiles = data.image; // Array of images

        // Upload all images to Cloudinary
        for (let i = 0; i < imageFiles.length; i++) {
            const formData = new FormData();
            formData.append("file", imageFiles[i]); // Attach the image file
            formData.append("upload_preset", uploadPreset); // Cloudinary upload preset

            const response = await fetch(cloudinaryUploadUrl, {
                method: "POST",
                body: formData,
            });

            const jsonResponse = await response.json();

            if (response.ok) {
                uploadedImages.push(jsonResponse.secure_url); // Push the secure URL to the array
            }
        }

        if (uploadedImages.length > 0) {
            const venueData = {
                venueName: data.venueName,
                venueType: data.venueType,
                description: data.description,
                address: data.address,
                capacity: parseInt(data.capacity),
                rentalPrice: parseFloat(data.rentalPrice),
                images: uploadedImages, // Save multiple image URLs
            };

            // Post the venue data
            const postVenue = await axiosSecure.post("/venues", venueData);

            if (postVenue) {
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Venue added successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    } catch (error) {
        console.error("Error uploading images:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There was an error uploading the images. Please try again.",
        });
    }
};

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-white">
        Add a New <span className="text-prime">Venue</span>
      </h2>

      {/* Form */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Venue Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Venue Name*</span>
            </label>
            <input
              type="text"
              {...register("venueName", { required: true })}
              placeholder="Venue Name"
              className="input input-bordered w-full"
            />
          </div>

          {/* Venue Type & Capacity */}
          <div className="flex items-center gap-4">
            {/* Venue Type */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Venue Type*</span>
              </label>
              <select
                {...register("venueType", { required: true })}
                className="select select-bordered"
                defaultValue="default"
              >
                <option disabled value="default">
                  Select a venue type
                </option>
                <option value="Conference">Conference</option>
                <option value="Event Space">Event Space</option>
                <option value="Outdoor Park">Outdoor Park</option>
                <option value="Wedding Venue">Wedding Venue</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {/* Capacity */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Capacity*</span>
              </label>
              <input
                type="number"
                {...register("capacity", { required: true })}
                placeholder="Max Capacity"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Rental Price */}
          <div className="form-control w-full my-6">
            <label className="label">
              <span className="label-text">Rental Price*</span>
            </label>
            <input
              type="number"
              {...register("rentalPrice", { required: true })}
              placeholder="Rental Price"
              className="input input-bordered w-full"
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description*</span>
            </label>
            <textarea
              {...register("description", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Describe the venue"
            ></textarea>
          </div>

          {/* Address */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address*</span>
            </label>
            <input
              type="text"
              {...register("address", { required: true })}
              placeholder="Venue Address"
              className="input input-bordered w-full"
            />
          </div>

          {/* Image Upload */}
          <div className="form-control w-full my-6">
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input w-full max-w-xs"
              multiple // Allow multiple files
            />
          </div>

          {/* Submit Button */}
          <button className="btn bg-prime text-white px-6">
            Add Venue <FaBuilding />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVenue;
