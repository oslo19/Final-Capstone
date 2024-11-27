import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth"; // assuming you use a hook for Firebase auth
import axios from "axios";
import FacebookLogin from "@greatsumini/react-facebook-login";
const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login, signUpWithGmail } = useAuth(); // Custom hook handling login and Google login
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
  // Login with Google
const handleGoogleLogin = () => {
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
        photoURL: user?.photoURL || "", // If available, otherwise set to an empty string
      };

      // Save the user info to MongoDB after Firebase authentication
      axios
        .post(`${BASE_URL}/users`, userInfo) // Use your backend URL here
        .then(() => {
          alert("Signin successful!");
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
      console.error("Google sign-in failed:", error.message);
      setErrorMessage("Google sign-in failed.");
    });
};

const handleFacebookLogin = () => {
  signUpWithFacebook()
    .then((profile) => {
      const userInfo = {
        firstName: profile.name.split(" ")[0],
        lastName: profile.name.split(" ").slice(1).join(" "),
        email: profile.email,
        photoURL: profile.picture?.data?.url || "",
      };

      axios.post(`${BASE_URL}/users`, userInfo).then(() => {
        alert("Signin successful!");
        navigate(from, { replace: true });
      });
    })
    .catch(() => setErrorMessage("Facebook sign-in failed."));
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
          <FacebookLogin
          appId="1294790831529557"
          onSuccess={(response) => {
            console.log("Login Success!", response);
            handleFacebookLogin();
          }}
          onFail={(error) => console.error("Login Failed!", error)}
          render={({ onClick }) => (
            <button
              onClick={onClick}
              className="btn btn-circle bg-prime text-white"
            >
              <FaFacebookF />
            </button>
          )}
        />
        </div>
      </div>
    </div>
  );
};

export default Login;
