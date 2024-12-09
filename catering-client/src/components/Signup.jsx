import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { getAuth, sendEmailVerification } from "firebase/auth";

const Signup = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { signUpWithGmail, createUser, updateUserProfile } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState(""); // store the email for the modal

  // Default navigation target is the home page
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      photoURL: data.photoURL,
    };

    try {
      // Create user in Firebase Authentication
      const result = await createUser(data.email, data.password);

      // Send email verification
      const auth = getAuth();
      await sendEmailVerification(auth.currentUser);

      // Update user profile with name and photoURL (optional)
      await updateUserProfile(data.firstName + ' ' + data.lastName, data.photoURL);

      // Save user info to MongoDB
      await axiosPublic.post("/users", userInfo);

      // Show the modal after successful signup
      setEmailForVerification(data.email); // set the email for the modal
      setShowModal(true); // Show the email verification modal

      // No redirect yet, wait for the user to verify the email
    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        const displayName = user?.displayName || "";
        const nameParts = displayName.split(" ");
        const firstName = nameParts.slice(0, -1).join(" ");
        const lastName = nameParts[nameParts.length - 1] || "";

        const userInfo = {
          firstName: firstName,
          lastName: lastName,
          email: user?.email,
          photoURL: user?.photoURL || "", 
        };

        // Save the user info to MongoDB after Firebase authentication
        axios
          .post(`${BASE_URL}/users`, userInfo)
          .then(() => {
            alert("Signup successful!");
            navigate(from, { replace: true });
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              alert("User already exists! Redirecting to the main page...");
              navigate(from, { replace: true });
            } else {
              alert("There was an issue saving your data. Please try again.");
              console.error(error);
            }
          });
      })
      .catch((error) => {
        alert("Google sign-in failed!");
        console.error(error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="max-w-md bg-white  w-full mx-auto flex items-center justify-center my-20">
        <div className="mb-5">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-bold text-lg">Please Create An Account!</h3>
            {/* first name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="First name"
                className="input input-bordered"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && <span className="text-red text-sm">This field is required</span>}
            </div>

            {/* last name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Last name"
                className="input input-bordered"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && <span className="text-red text-sm">This field is required</span>}
            </div>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red text-sm">{errors.email.message}</span>
              )}
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
                    message: "Password must contain at least one uppercase letter and one special character, and be at least 6 characters long",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red text-sm">{errors.password.message}</span>
              )}
            </div>

            {/* error message */}
            <p>{errors.message}</p>

            {/* submit btn */}
            <div className="form-control mt-6">
              <input
                type="submit"
                className="btn bg-prime text-white"
                value="Sign up"
              />
            </div>

            <div className="text-center my-2">
              Have an account?
              <Link to="/login">
                <button className="ml-2 underline text-prime">Login here</button>
              </Link>
            </div>
          </form>
          <div className="text-center space-x-3">
            <button
              onClick={handleRegister}
              className="btn btn-circle hover:bg-prime hover:text-white"
            >
              <FaGoogle />
            </button>
            <button className="btn btn-circle hover:bg-prime hover:text-white">
              <FaFacebookF />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="font-bold text-xl">Email Verification Required</h2>
            <p>We've sent a verification link to <strong>{emailForVerification}</strong>. Please check your inbox and verify your email to complete the sign-up process.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
