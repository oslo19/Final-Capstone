import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth"; // assuming you use a hook for Firebase auth
import axios from "axios";
import FacebookLogin from "@greatsumini/react-facebook-login";
import ForgotPassword from './ForgotPassword';
import { getAuth, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"; // Add Firebase auth functions

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login, signUpWithGmail } = useAuth(); // Custom hook handling login and Google login
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [email, setEmail] = useState(""); // Store email for verification
  const [password, setPassword] = useState(""); // Store password

  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // State for Firebase user and their verification status
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Set up Firebase authentication state change listener
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("User state changed:", currentUser);  // Log the user state change for debugging
      if (currentUser) {
        setUser(currentUser);
        setIsVerified(currentUser.emailVerified);
      } else {
        setUser(null);
        setIsVerified(false);
      }
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Login with email and password
  const onSubmit = async (data) => {
    const { email, password } = data;
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        // If email is not verified, show the verification modal
        setEmailForVerification(email);
        setShowEmailVerificationModal(true);
        sendEmailVerification(user); // Optionally resend verification email
      } else {
        alert("Login successful!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);  // Log the error for debugging
      setErrorMessage("Please provide valid email & password!");
    }

    reset();
  };

  // Login with Google
  const handleGoogleLogin = () => {
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

  // Handle Facebook login
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

  // Handle opening Forgot Password modal
  const openForgotPasswordModal = () => {
    setShowForgotPassword(true); // Show the modal
  };

  // Close the ForgotPassword modal
  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false); // Close the modal
  };

  // Close the Email Verification modal
  const closeEmailVerificationModal = () => {
    setShowEmailVerificationModal(false);
  };

  // Resend the verification email
  const handleResendVerification = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    sendEmailVerification(user);
    alert("Verification email sent again. Please check your inbox.");
  };

  // Automatically close the modal if the email is verified
  useEffect(() => {
    if (isVerified) {
      setShowEmailVerificationModal(false);
    }
  }, [isVerified]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">

      {/* Background overlay when modal is open */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40" onClick={closeForgotPasswordModal}></div>
      )}

      {/* Centered login box */}
      <div className="max-w-md w-full bg-white shadow-lg p-8 rounded-lg z-50">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg mb-4">Please Login!</h3>

          {/* Email Input */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered"
              {...register("email", { required: true })}
            />
          </div>

          {/* Password Input */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered"
              {...register("password", { required: true })}
            />
            <label className="label">
              <a 
                onClick={openForgotPasswordModal}
                href="#" 
                className="label-text-alt link link-hover mt-2 text-lg ">
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
            Don't have an account?
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
            onSuccess={(response) => handleFacebookLogin(response)}
            onFail={(error) => console.error("Login Failed!", error)}
            render={({ onClick }) => (
              <button
                onClick={onClick}
                className="btn btn-circle hover:bg-prime  hover:text-white"
              >
                <FaFacebookF />
              </button>
            )}
          />
        </div>
      </div>

      {/* Conditionally render the ForgotPassword modal */}
      {showForgotPassword && <ForgotPassword closeModal={closeForgotPasswordModal} />}

      {/* Modal for Email Verification */}
      {showEmailVerificationModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="font-bold text-xl">Email Verification Required</h2>
            <p className="mt-4">
              We'll send a login link to <strong>{emailForVerification}</strong>. 
              Check your email and click the link to complete the verification process.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={handleResendVerification}>Resend Verification</button>
              <button className="btn" onClick={closeEmailVerificationModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
