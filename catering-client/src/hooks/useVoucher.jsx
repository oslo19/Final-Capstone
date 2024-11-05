import React from 'react'
import useAxiosPublic from './useAxiosPublic'
import { useQuery } from '@tanstack/react-query';

const useVoucher = () => {
    const axiosPublic = useAxiosPublic();

    const {data: voucher =[], isPending: loading, refetch} = useQuery({
        queryKey: ['voucher'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/voucher`);
            console.log(res.data)
            return res.data;
          },
    })

  return [voucher, loading, refetch]
}

export default useVoucher