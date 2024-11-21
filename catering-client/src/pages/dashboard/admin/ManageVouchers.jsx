import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useVoucher from "../../../hooks/useVoucher";

const ManageVouchers = () => {
  const [vouchers, , refetch] = useVoucher();
  const axiosSecure = useAxiosSecure();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const handleDeleteItem = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/voucher/${item._id}`);
        if (res) {
          refetch();
          Swal.fire("Deleted!", "Your voucher has been deleted.", "success");
        }
      }
    });
  };

  const now = new Date();
  const expiredVouchers = vouchers.filter(
    (voucher) => new Date(voucher.validUntil) <= now
  );
  const activeVouchers = vouchers.filter(
    (voucher) => new Date(voucher.validUntil) > now
  );

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto text-black">
      <h2 className="text-2xl font-semibold my-4">
        Manage All <span className="text-prime">Vouchers</span>
      </h2>

      <h3 className="text-xl mt-8">Active Vouchers</h3>
      <VoucherTable vouchers={activeVouchers} handleDeleteItem={handleDeleteItem} />

      <h3 className="text-xl mt-8">Expired Vouchers</h3>
      <VoucherTable vouchers={expiredVouchers} handleDeleteItem={handleDeleteItem} />
    </div>
  );
};

const VoucherTable = ({ vouchers, handleDeleteItem }) => (
  <div className="overflow-x-auto">
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Item ID</th>
          <th>Code</th>
          <th>Discount</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {vouchers.map((item, index) => (
          <tr key={item._id}>
            <td>{index + 1}</td>
            <td>{item._id}</td>
            <td>{item.code}</td>
            <td>{item.discountPercentage}%</td>
            <td>{item.description}</td>
            <td>
              <Link to={`/dashboard/update-voucher/${item._id}`}>
                <button className="btn btn-ghost btn-xs bg-prime-500 text-black">
                  <FaEdit />
                </button>
              </Link>
              <button
                onClick={() => handleDeleteItem(item)}
                className="btn btn-ghost btn-xs text-red"
              >
                <FaTrashAlt />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ManageVouchers;
