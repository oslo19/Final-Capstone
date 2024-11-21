import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddVoucher = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const axiosSecure = useAxiosSecure();
  const [voucherCode, setVoucherCode] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  // Function to generate a random voucher code
  const generateVoucherCode = () => {
    const code = "VOUCH-" + Math.random().toString(36).substr(2, 8).toUpperCase();
    setVoucherCode(code); // Set code to state
    setValue("code", code); // Set code in the form
  };

  const onSubmit = async (data) => {
    const voucherData = {
      code: voucherCode || data.code,
      discountType: data.discountType,
      discountValue: parseFloat(data.discountValue),
      validUntil: data.validUntil,
      maxUsage: parseInt(data.maxUsage),
      description: data.description,
      minimumSpend: parseFloat(data.minimumSpend),
      isActive: true,
    };
  
    try {
      const response = await axiosSecure.post("/voucher", voucherData);
  
      if (response.status === 201) {
        reset(); // Clear form fields
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Voucher added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error adding voucher:", error);
  
      let errorMessage = "There was an error adding the voucher!";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message;
      }
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };
  
  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-white">
        Add a New <span className="text-prime">Voucher</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Voucher Code */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Voucher Code*</span>
          </label>
          <div className="flex items-center">
            <input
              type="text"
              {...register("code", { required: true })}
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Enter or generate voucher code"
              className="input input-bordered w-full"
            />
            <button
              type="button"
              onClick={generateVoucherCode}
              className="btn btn-secondary ml-2"
            >
              Generate Code
            </button>
          </div>
        </div>

        {/* Discount Type */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Discount Type*</span>
          </label>
          <select
            {...register("discountType", { required: true })}
            className="input input-bordered w-full"
          >
            <option value="flat">Flat Discount</option>
            <option value="percentage">Percentage Discount</option>
          </select>
        </div>

        {/* Discount Value */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Discount Value*</span>
          </label>
          <input
            type="number"
            {...register("discountValue", { required: true })}
            placeholder="Enter discount value"
            className="input input-bordered w-full"
          />
        </div>

        {/* Maximum Usage */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Max Usage*</span>
          </label>
          <input
            type="number"
            {...register("maxUsage", { required: true })}
            placeholder="Enter maximum usage limit"
            className="input input-bordered w-full"
          />
        </div>

        {/* Minimum Spend */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Minimum Spend (in Pesos)*</span>
          </label>
          <input
            type="number"
            {...register("minimumSpend", { required: true })}
            placeholder="Enter minimum spend amount"
            className="input input-bordered w-full"
          />
        </div>

        {/* Expiration DateTime */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Valid Until*</span>
          </label>
          <input
            type="datetime-local" // Date and Time input
            {...register("validUntil", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Description */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            {...register("description")}
            className="textarea textarea-bordered h-24"
            placeholder="Add a short description of the voucher"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button className="btn bg-prime text-white px-6">Add Voucher</button>
      </form>
    </div>
  );
};

export default AddVoucher;
