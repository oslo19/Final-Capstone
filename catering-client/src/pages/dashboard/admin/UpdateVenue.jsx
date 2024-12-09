import React from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAxiosPublic from '../../../hooks/useAxiosPublic'
import { useForm } from 'react-hook-form'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { FaHotel } from 'react-icons/fa'

const UpdateVenue = () => {
  const item = useLoaderData()
  const { register, handleSubmit, reset } = useForm()
  const axiosPublic = useAxiosPublic()
  const axiosSecure = useAxiosSecure()
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()

  // Cloudinary API URL and Upload Preset
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/dtg6ofu1q/image/upload`
  const uploadPreset = "unsigned_preset" // Replace with your Cloudinary upload preset

  const onSubmit = async (data) => {
    let imageUrl = item.image

    // If a new image is uploaded, upload it to Cloudinary
    if (data.image?.[0]) {
      const imageFile = data.image[0]
      try {
        const formData = new FormData()
        formData.append("file", imageFile)  // Attach the image file
        formData.append("upload_preset", uploadPreset)  // Cloudinary preset

        // Upload image to Cloudinary
        const response = await fetch(cloudinaryUploadUrl, {
          method: "POST",
          body: formData,
        })

        const jsonResponse = await response.json()

        if (response.ok) {
          imageUrl = jsonResponse.secure_url // Cloudinary image URL
        } else {
          Swal.fire("Error", "Image upload failed. Please try again.", "error")
          return
        }
      } catch (error) {
        console.error("Image upload error:", error)
        Swal.fire("Error", "Image upload failed. Please try again.", "error")
        return
      }
    }

    // Prepare venue data for submission
    const venueData = {
      venueName: data.venueName,
      capacity: parseInt(data.capacity),
      rentalPrice: parseFloat(data.rentalPrice),
      description: data.description,
      image: imageUrl,
    }

    // Update the venue
    try {
      const postVenue = await axiosSecure.patch(`/venues/${item._id}`, venueData)

      if (postVenue.status === 200) {
        reset()
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your venue has been updated!",
          showConfirmButton: false,
          timer: 1500,
        })
        navigate("/dashboard/manage-venues")
      }
    } catch (error) {
      console.error("Venue update error:", error)
      Swal.fire("Error", "Failed to update venue. Please try again.", "error")
    }
  }

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Update This <span className="text-prime">Venue</span>
      </h2>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Venue Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Venue Name*</span>
            </label>
            <input
              type="text"
              defaultValue={item.venueName}
              {...register("venueName", { required: true })}
              placeholder="Venue Name"
              className="input input-bordered w-full"
            />
          </div>

          {/* 2nd row */}
          <div className="flex items-center gap-4">
            {/* Capacity */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Capacity*</span>
              </label>
              <input
                type="number"
                defaultValue={item.capacity}
                {...register("capacity", { required: true })}
                placeholder="Capacity"
                className="input input-bordered w-full"
              />
            </div>

            {/* Rental Price */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Rental Price*</span>
              </label>
              <input
                type="number"
                defaultValue={item.rentalPrice}
                {...register("rentalPrice", { required: true })}
                placeholder="Rental Price"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Venue Description</span>
            </label>
            <textarea
              defaultValue={item.description}
              {...register("description", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the world about your venue"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-control w-full my-6">
            <input
              {...register("image")}
              type="file"
              className="file-input w-full max-w-xs"
            />
          </div>

          <button className="btn bg-prime text-white px-6">
            Update Venue <FaHotel />
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateVenue
