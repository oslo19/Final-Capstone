import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useVenueDetails = (id) => {
    const axiosPublic = useAxiosPublic();

    const { data: venue = {}, isPending: loading, refetch } = useQuery({
        queryKey: ['venues', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/venues/${id}`);
            return res.data;
        },
        enabled: !!id, // Ensure it only runs if id is present
    });

    return [venue, loading, refetch];
};

export default useVenueDetails;
