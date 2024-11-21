import React from 'react'
import useAxiosPublic from './useAxiosPublic'
import { useQuery } from '@tanstack/react-query';

const usePackage = () => {
    const axiosPublic = useAxiosPublic();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const {data: packages =[], isPending: loading, refetch} = useQuery({
        queryKey: ['packages'],
        queryFn: async () => {
            const res = await axiosPublic.get('/packages');
            console.log(res.data)
            return res.data;
          },
    })

  return [packages, loading, refetch]
}

export default usePackage