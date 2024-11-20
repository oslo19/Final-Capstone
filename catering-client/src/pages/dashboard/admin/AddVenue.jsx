import React from "react";
import { FaBuilding } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddVenue = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  // Image hosting key
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    const uploadedImages = [];
    const imageFiles = data.image; // Array of images

    // Upload all images to image hosting
    for (let i = 0; i < imageFiles.length; i++) {
      const formData = new FormData();
      formData.append("image", imageFiles[i]);
      const hostingImg = await axiosPublic.post(image_hosting_api, formData);

      if (hostingImg.data.success) {
        uploadedImages.push(hostingImg.data.data.display_url);
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
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-white">
        Add a New <span className="text-prime">Venue</span>
      </h2>

      {/* Form */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
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

          {/* 2nd row */}
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

          {/* 3rd row */}
          <div className="flex items-center gap-4">
            {/* Rental Price */}
            <div className="form-control w-full">
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
          </div>

          {/* 4th row */}
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

          {/* 5th row */}
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
