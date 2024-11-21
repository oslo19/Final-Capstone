import React from 'react'
import useAxiosPublic from './useAxiosPublic'
import { useQuery } from '@tanstack/react-query';

const useMenu = () => {
    const axiosPublic = useAxiosPublic();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const {data: menu =[], isPending: loading, refetch} = useQuery({
        queryKey: ['menu'],
        queryFn: async () => {
            const res = await axiosPublic.get('/menu');
            console.log(res.data)
            return res.data;
          },
    })

  return [menu, loading, refetch]
}

export default useMenu