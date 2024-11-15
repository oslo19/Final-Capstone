import React from "react";
import useVenue from "../../../hooks/useVenue";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageVenues = () => {
  const [venues, , refetch] = useVenue();
  const axiosSecure = useAxiosSecure();

  // Handle Delete Venue
  const handleDeleteVenue = (venue) => {
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
        const res = await axiosSecure.delete(`/venues/${venue._id}`);
        if (res) {
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "Your venue has been deleted.",
            icon: "success",
          });
        }
      }
    });
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto text-black">
      <h2 className="text-2xl font-semibold my-4">
        Manage All <span className="text-prime">Venues</span>
      </h2>
      {/* Venue item table */}
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Venue Name</th>
                <th>Capacity</th>
                <th>Rental Price</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={venue.image} alt="" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{venue.venueName}</td>
                  <td>{venue.capacity}</td>
                  <td>₱{venue.rentalPrice}</td>
                  <td>
                    <Link to={`/dashboard/update-venue/${venue._id}`}>
                      <button className="btn btn-ghost btn-xs bg-prime-500 text-black">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteVenue(venue)}
                      className="btn btn-ghost btn-xs text-red"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Other rows */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageVenues;
