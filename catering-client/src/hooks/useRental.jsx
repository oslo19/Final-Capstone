import React from 'react'
import useAxiosPublic from './useAxiosPublic'
import { useQuery } from '@tanstack/react-query';

const useRental = () => {
    const axiosPublic = useAxiosPublic();

    const {data: rental =[], isPending: loading, refetch} = useQuery({
        queryKey: ['rental'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/rental`);
            console.log(res.data)
            return res.data;
          },
    })

  return [rental, loading, refetch]
}

export default useRental