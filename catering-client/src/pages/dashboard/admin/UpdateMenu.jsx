import React from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUtensils } from 'react-icons/fa';
import useMenu from '../../../hooks/useMenu';

const UpdateMenu = () => {
  const [menu, , refetch] = useMenu();
  const item = useLoaderData();
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  // image hosting key
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    let imageUrl = item.image;

    // If a new image is uploaded, upload it to the image hosting service
    if (data.image?.[0]) {
      const imageFile = { image: data.image[0] };
      try {
        const hostingImg = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: { "content-type": "multipart/form-data" },
        });

        if (hostingImg.data.success) {
          imageUrl = hostingImg.data.data.display_url;
        } else {
          Swal.fire("Error", "Image upload failed. Please try again.", "error");
          return;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        Swal.fire("Error", "Image upload failed. Please try again.", "error");
        return;
      }
    }

    const menuItem = {
      name: data.name,
      category: data.category,
      price: parseFloat(data.price),
      recipe: data.recipe,
      menuTypes: data.menuTypes || [], // Updated to handle multiple selection
      image: imageUrl,
    };

    try {
      const response = await axiosSecure.patch(`/menu/${item._id}`, menuItem);
      if (response.status === 200) {
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your item updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/manage-items");
        refetch();
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update item. Please try again.", "error");
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Update This <span className="text-prime">Menu Item</span>
      </h2>

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
                defaultValue={item.category}
              >
                <option disabled value="default">Select a category</option>
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
                defaultValue={item.price}
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
                  defaultChecked={item.menuTypes?.includes("buffet")}
                />{" "}
                Buffet
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("menuTypes")}
                  value="packed meals"
                  defaultChecked={item.menuTypes?.includes("packed meals")}
                />{" "}
                Packed Meals
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("menuTypes")}
                  value="cocktail"
                  defaultChecked={item.menuTypes?.includes("cocktail")}
                />{" "}
                Cocktail
              </label>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Details</span>
            </label>
            <textarea
              defaultValue={item.recipe}
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the world about your recipe"
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
            Update Item <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateMenu;
