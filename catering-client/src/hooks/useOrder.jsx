import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useOrder = () => {
  const axiosPublic = useAxiosPublic();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const { data: orders = [], isPending: loading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosPublic.get("/orders/all");
      console.log("All orders:", res.data);

      // Return all orders for filtering in Profile.jsx
      return res.data.orders;
    },
  });

  return { orders, loading, refetch };
};

export default useOrder;
