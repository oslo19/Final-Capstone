import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useProduct = (id) => {
    const axiosPublic = useAxiosPublic();

    const { data: product = {}, isPending: loading, refetch } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/menu/${id}`);
            return res.data;
        },
        enabled: !!id, // Ensure it only runs if id is present
    });

    return [product, loading, refetch];
};

export default useProduct;
