import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const ManageContracts = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [contracts, setContracts] = useState([]);

  // Fetch all contracts
  const fetchContracts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/contracts/all`);
      setContracts(response.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Handle contract deletion
  const handleDeleteContract = (contractId) => {
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
        try {
          const response = await axios.delete(`${BASE_URL}/contracts/${contractId}`);
          if (response.status === 200) {
            fetchContracts(); // Refetch contracts after deletion
            Swal.fire("Deleted!", "The contract has been deleted.", "success");
          }
        } catch (error) {
          console.error("Error deleting contract:", error);
          Swal.fire("Error!", "There was an issue deleting the contract.", "error");
        }
      }
    });
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto text-black">
      <h2 className="text-2xl font-semibold my-4">
        Manage <span className="text-prime">Contracts</span>
      </h2>
      {/* Contract table */}
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* Table Head */}
            <thead>
              <tr>
                <th>#</th>
                <th>File</th>
                <th>Uploaded At</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length > 0 ? (
                contracts.map((contract, index) => (
                  <tr key={contract._id}>
                    <th>{index + 1}</th>
                    <td>
                      <a
                        href={`${BASE_URL}/uploads/contracts/${contract.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    </td>
                    <td>{new Date(contract.uploadedAt).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteContract(contract._id)}
                        className="btn btn-ghost btn-xs text-red"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No contracts available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageContracts;
