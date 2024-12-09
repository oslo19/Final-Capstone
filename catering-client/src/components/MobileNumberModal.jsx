import React, { useContext, useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";

const MobileNumberModal = ({ mobileNumber, confirmationResult, currentUserId, onClose}) => {
  const [otp, setOtp] = useState(""); // OTP input state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Button state
  const [isVerifying, setIsVerifying] = useState(false); // Spinner state
  const modalRef = useRef(null); // Ref to access the dialog
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpStatus, setOtpStatus] = useState("");
  
console.log(otp)
  useEffect(() => {
    if (modalRef.current) modalRef.current.showModal();
  }, []);

  // Enable button only if OTP is exactly 6 digits
  useEffect(() => {
    setIsButtonDisabled(otp.length !== 6);
  }, [otp]);

  const handleClose = () => {
    if (modalRef.current) modalRef.current.close(); // Close the modal
    onClose(); // Notify the parent component to hide the modal
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    setIsVerifying(true);  // Show spinner
  
    // Format the mobile number before sending it
    
  
    try {
      const response = await axiosSecure.post("/otp/verify-code", {
        phone_number: mobileNumber, 
        code: otp,
      });
  
      if (response.status === 200) {
        // OTP verified successfully
        Swal.fire("Success", "Mobile number verified!", "success");
        onClose(); // Close the modal after successful verification
      } else {
        throw new Error(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setIsVerifying(false); // Hide spinner
    }
  };
  
  


  const handleResendOtp = async () => {
    setIsSubmitting(true);  // Show spinner
    setOtpStatus(""); 
    const formattedNumber = `+63${mobileNumber.startsWith("0") ? mobileNumber.slice(1) : mobileNumber}`;
  
    try {
      const response = await axios.get(`/otp/otp/check-expiry/${mobileNumber}`);
      // Send OTP again to the phone number
      const otpResponse = await axiosSecure.post("/otp/send-code", {
        phone_number: mobileNumber,
      });
  
      if (otpResponse.status === 200) {
        console.log("OTP sent successfully:", otpResponse.data);
        setOtpStatus({ message: "OTP has been resent successfully!", color: "green" });
      } else {
        throw new Error(otpResponse.data.message || "An OTP has already been sent. Please wait for it to expire before requesting a new one.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setOtpStatus({ message: "An OTP has already been sent. Please wait for it to expire before requesting a new one.", color: "red" });
    } finally {
      setIsSubmitting(false);  // Hide spinner after the process is complete
    }
  };
  
  
  


  return (
    <dialog ref={modalRef} className="modal z-0">
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
          <span className="btn btn-ghost" onClick={handleResendOtp}>
            Resend Code
          </span>
        </p>

           {/* Display OTP status message */}
        {otpStatus && (
          <p className="text-center my-4" style={{ color: otpStatus.color }}>
            {otpStatus.message}
          </p>
        )}

        
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
