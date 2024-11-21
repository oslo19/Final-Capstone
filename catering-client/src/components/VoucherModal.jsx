import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../hooks/useAxiosSecure';

const VoucherModal = ({ vouchers, cartSubtotal, onApplyVoucher, user }) => {
  const modalRef = useRef(null);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const axiosSecure = useAxiosSecure();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const now = new Date().toISOString(); // Get current time in UTC format
  
    const validVouchers = vouchers.filter((voucher) => {
      const voucherExpiry = new Date(voucher.validUntil).toISOString(); // Convert expiry to UTC
      return voucherExpiry > now; // Compare in UTC format
    });
  
    setFilteredVouchers(validVouchers);
  
    // Avoid showing unnecessary alerts if there are valid vouchers
    if (validVouchers.length === 0) {
      console.log("No valid vouchers available.");
    }
  }, [vouchers]);
  
  const handleApply = async (voucher) => {
    try {
      const response = await axiosSecure.post('/voucher/validate', {
        code: voucher.code,
        amountSpent: cartSubtotal, // Removed userId
      });
  
      Swal.fire("Success", response.data.message, "success");
      onApplyVoucher(voucher); // Apply the voucher after successful validation
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "An error occurred",
        "error"
      );
    }
  };

  const formatDiscount = (voucher) =>
    voucher.discountType === 'percentage'
      ? `${voucher.discountValue}% off`
      : `₱${voucher.discountValue} off`;

  return (
    <dialog ref={modalRef} id="vouchermodal" className="modal">
      <div className="modal-box max-w-xl">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => modalRef.current.close()}
            aria-label="Close"
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-2xl mb-4">Select Voucher</h3>
        <div className="divider"></div>

        <div className="mt-5 flex flex-col">
          {filteredVouchers.length > 0 ? (
            filteredVouchers.map((voucher, index) => {
              const isEligible = cartSubtotal >= voucher.minimumSpend;

              return (
                <div key={index} className="container mx-auto mt-3">
                  <div
                    className={`bg-gradient-to-br from-gray-700 to-gray-900 text-white text-center py-8 px-16 rounded-lg shadow-md relative ${
                      !isEligible ? 'opacity-50' : ''
                    }`}
                  >
                    <h3 className="text-2xl font-semibold mb-4">
                      {formatDiscount(voucher)} - {voucher.description}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 mb-6">
                      <span className="border-dashed border text-white px-4 py-2 rounded-l">
                        {voucher.code}
                      </span>
                      <button
                        className={`border border-white bg-white text-purple-600 px-4 py-2 rounded-r ${
                          isEligible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                        onClick={() => handleApply(voucher)}
                        disabled={!isEligible}
                      >
                        Apply Code
                      </button>
                    </div>
                    <p className="text-sm">Valid Until: {voucher.validUntil}</p>

                    {!isEligible && (
                      <p className="text-sm italic mt-2">
                        Spend ₱{voucher.minimumSpend} to use this voucher.
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-5">No valid vouchers available.</p>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default VoucherModal;
