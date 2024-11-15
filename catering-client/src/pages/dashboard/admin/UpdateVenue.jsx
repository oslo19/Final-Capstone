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

  const navigate = useNavigate()

  // image hosting key
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

  const onSubmit = async (data) => {
    const imageFile = { image: data.image[0] }
    const hostingImg = await axiosPublic.post(image_hosting_api, imageFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })

    if (hostingImg.data.success) {
      const venueData = {
        venueName: data.venueName,
        capacity: parseInt(data.capacity),
        rentalPrice: parseFloat(data.rentalPrice),
        description: data.description,
        image: hostingImg.data.data.display_url,
      }

      // Update the venue
      const postVenue = axiosSecure.patch(`/venues/${item._id}`, venueData)

      if (postVenue) {
        reset()
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your venue has been updated!",
          showConfirmButton: false,
          timer: 1500
        })
        navigate("/dashboard/manage-venues")
      }
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
