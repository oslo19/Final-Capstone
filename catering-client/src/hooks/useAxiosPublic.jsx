import axios from 'axios';


const BASE_URL = import.meta.env.VITE_BACKEND_URL;


const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

// Custom hook to return the Axios instance
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
