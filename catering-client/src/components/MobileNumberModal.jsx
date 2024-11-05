import React, { useContext, useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../contexts/AuthProvider";
import { getAuth, PhoneAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const MobileNumberModal = ({ mobileNumber, confirmationResult, currentUserId, onClose }) => {
  const [otp, setOtp] = useState(""); // OTP input state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Button state
  const [isVerifying, setIsVerifying] = useState(false); // Spinner state
  const modalRef = useRef(null); // Ref to access the dialog
  const axiosSecure = useAxiosSecure();  
  const { auth } = useContext(AuthContext);

  // Show the modal once the component mounts
  useEffect(() => {
    if (modalRef.current) modalRef.current.showModal();
  }, []);

  
  // Enable button only if OTP is exactly 6 digits
  useEffect(() => {
    setIsButtonDisabled(otp.length !== 6);
  }, [otp]);

  // Log only when necessary (e.g., when the modal opens or OTP submission succeeds)
  useEffect(() => {
    console.log("Current User ID:", currentUserId); // Log once when the modal opens
  }, [currentUserId]);



  const handleClose = () => {
    if (modalRef.current) modalRef.current.close(); // Close the modal
    onClose(); // Notify the parent component to hide the modal
  };

  const handleVerifyOTP = async () => {
    setIsVerifying(true); // Show spinner

    try {
        const response = await axiosSecure.post('/otp/verify-code', {
            phone_number: mobileNumber,
            code: otp,
        });

        if (response.status === 200) {
            const saveResponse = await axiosSecure.put(`/users/${currentUserId}/mobile`, {
                phone_number: mobileNumber,
            });

            if (saveResponse.status === 200) {
                Swal.fire("Success", "Mobile number verified and saved!", "success");
                handleClose(); // Close the modal
            } else {
                throw new Error(saveResponse.data.message || "Failed to save mobile number");
            }
        } else {
            throw new Error(response.data.message || "OTP verification failed");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error); // Log the error
        Swal.fire("Error", error.message, "error");
    } finally {
        setIsVerifying(false); // Hide spinner
    }
};


  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-3xl text-black">
        <h3 className="font-bold text-2xl">Verify your mobile number</h3>
        <p className="py-4 text-lg font-normal my-6">
          We&#x27;ve sent a 6-digit code to {mobileNumber}.
        </p>
        <OtpInput
          value={otp}
          onChange={setOtp} // Use the optimized handler
          numInputs={6}
          containerStyle="otp-container"
          inputStyle="otp-input"
          renderInput={(props) => <input {...props} />}
        />
        <button
          className={`btn bg-prime text-white hover:bg-orange-500 my-4 w-full h-14 relative z-0 rounded-lg transition-all duration-300 ease-in-out hover:scale-y-105 ${
            isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isButtonDisabled}
          onClick={handleVerifyOTP}
        >
          {isVerifying && <CgSpinner size={20} className="animate-spin mr-2" />}
          <span>Verify OTP</span>
        </button>

        <div className="w-full border-t border-gray-300 my-6"></div>

        <p className="text-center">
          Didn&#x27;t receive it?{" "}
          <span className="btn btn-ghost" onClick={() => window.location.reload()}>
            Resend Code
          </span>
        </p>

        <button
          onClick={handleClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </div>
    </dialog>
  );
};

export default MobileNumberModal;
