import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import usePackage from "../../../../hooks/usePackage";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const ManageItems = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [packages, , refetch] = usePackage();
  const axiosSecure = useAxiosSecure();
//   console.log(menu);

  //   handleDeleteItem
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
        const res = await axiosSecure.delete(`/packages/${item._id}`);
         //console.log(res);
       if(res) {
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
       }
      }
    });
  };
  return (
    <div className="w-full md:w-[870px] px-4 mx-auto text-black">
      <h2 className="text-2xl font-semibold my-4">
        Manage All <span className="text-prime">Package Items</span>
      </h2>
      {/* menu item table */}
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((item, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={item.image} alt="" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>₱{item.price}</td>
                  <td>
                    <Link to={`/dashboard/update-packages/${item._id}`}>
                      <button className="btn btn-ghost btn-xs bg-prime-500 text-black">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="btn btn-ghost btn-xs text-red"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
              {/* row 1 */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageItems;
