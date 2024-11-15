import React from 'react'
import useAxiosPublic from './useAxiosPublic'
import { useQuery } from '@tanstack/react-query';

const useVenue = () => {
    const axiosPublic = useAxiosPublic();

    const {data: venue =[], isPending: loading, refetch} = useQuery({
        queryKey: ['rental'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/venue`);
            console.log(res.data)
            return res.data;
          },
    })

  return [venue, loading, refetch]
}

export default useVenue