import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth"; // assuming you use a hook for Firebase auth

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login, signUpWithGmail } = useAuth(); // Custom hook handling login and Google login
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Login with email and password
  const onSubmit = (data) => {
    const { email, password } = data;

    login(email, password)
      .then(() => {
        alert("Login successful!");
        navigate(from, { replace: true });
      })
      .catch(() => {
        setErrorMessage("Please provide valid email & password!");
      });

    reset();
  };

  // Login with Google
  const handleGoogleLogin = () => {
    signUpWithGmail()
      .then(() => {
        alert("Signin successful!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Google sign-in failed:", error.message);
        setErrorMessage("Google sign-in failed.");
      });
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form className="card-body" method="dialog" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Please Login!</h3>

          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email", { required: true })}
            />
          </div>

          {/* Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              {...register("password", { required: true })}
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover mt-2">
                Forgot password?
              </a>
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red text-xs italic">{errorMessage}</p>}

          {/* Submit Button */}
          <div className="form-control mt-4">
            <input type="submit" className="btn bg-prime text-white" value="Login" />
          </div>

          {/* Close Button */}
          <Link to="/">
            <div className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</div>
          </Link>

          <p className="text-center my-2">
            Dont have an account?
            <Link to="/signup" className="underline text-red ml-1">Signup Now</Link>
          </p>
        </form>

        <div className="text-center space-x-3">
          {/* Google Login Button */}
          <button onClick={handleGoogleLogin} className="btn btn-circle hover:bg-prime hover:text-white">
            <FaGoogle />
          </button>
          {/* Other buttons */}
          <button className="btn btn-circle hover:bg-prime hover:text-white"><FaFacebookF /></button>
        </div>
      </div>
    </div>
  );
};

export default Login;
