import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle, FaRegUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Signup = () => {
  const { signUpWithGmail, createUser, updateUserProfile } =
    useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();

  // Default navigation target is the home page
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const userInfo = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      photoURL: data.photoURL,
    };
    
    createUser(data.email, data.password)
      .then((result) => {
        updateUserProfile(data.firstName + ' ' + data.lastName, data.photoURL).then(() => {
          axiosPublic.post("/users", userInfo)
            .then(() => {
              alert("Signup successful!");
              navigate(from, { replace: true });
            });
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
  
        // Extract full displayName
        const displayName = user?.displayName || "";
        const nameParts = displayName.split(" ");
  
        // Assuming first name consists of the first two parts (e.g., "Genard Rey")
        const firstName = nameParts.slice(0, -1).join(" ");
        // Last name is the last part (e.g., "Zozobrado")
        const lastName = nameParts[nameParts.length - 1] || "";
  
        const userInfo = {
          firstName: firstName,
          lastName: lastName,
          email: user?.email,
        };
  
        // Saving the user info to the backend
        axios
          .post("http://localhost:6001/users", userInfo)
          .then(() => {
            alert("Signup successful!");
            navigate(from, { replace: true });
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              alert("User already exists! Redirecting to the main page...");
              navigate(from, { replace: true });
            } else {
              alert("There was an issue signing up. Please try again.");
            }
          });
      })
      .catch((error) => {
        alert("Google sign-in failed!");
      });
  };
  
  


  return (
    <div className="max-w-md  w-full mx-auto flex items-center justify-center my-20">
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
            {errors.firstName && <span>This field is required</span>}
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
            {errors.lastName && <span>This field is required</span>}
          </div>

          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email")}
            />
          </div>

          {/* password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
              {...register("password")}
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover mt-2">
                Forgot password?
              </a>
            </label>
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
              <button className="ml-2 underline">Login here</button>
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
  );
};

export default Signup;