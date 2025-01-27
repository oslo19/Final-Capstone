import axios from "axios";
import {useNavigate} from "react-router-dom"
import useAuth from "./useAuth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const axiosSecure= axios.create({
  baseURL: BASE_URL,
});


const useAxiosSecure = () => {
    const navigate = useNavigate();
    const {logOut} = useAuth();

    axiosSecure.interceptors.request.use(function (config) {
        // Do something before request is sent
        const token = localStorage.getItem('access-token');
        config.headers.authorization =`Bearer ${token}`
        return config;
      }, function (error) {
        // Do something with request error
        return Promise.reject(error);
      });

// Add a response interceptor
axiosSecure.interceptors.response.use(function (response) {
  return response;
}, async (error) => {
  const status = error?.response?.status;

  // Handle unauthorized or forbidden responses
  if (status === 401 || status === 403) {
    await logOut();
    navigate("/login");
  }

  // Handle other types of errors like server or network failures
  if (!error.response) {
    console.error("Network error or server down");
  }

  return Promise.reject(error);
});

  return axiosSecure
}

export default useAxiosSecure;