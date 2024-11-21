import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useRentalDetails = (id) => {
    const axiosPublic = useAxiosPublic();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const { data: rental = {}, isPending: loading, refetch } = useQuery({
        queryKey: ['rental', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/rental/${id}`);
            return res.data;
        },
        enabled: !!id, // Ensure it only runs if id is present
    });

    return [rental, loading, refetch];
};

export default useRentalDetails;
