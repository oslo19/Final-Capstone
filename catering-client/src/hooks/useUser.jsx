import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import axios from 'axios'; // Ensure axios is installed and imported

const useUsers = () => {
    const token = localStorage.getItem('access-token');

    const { refetch, data: users = [], isLoading: isUserLoading } = useQuery({
        queryKey: ['users'],
        enabled: !!token, // Only run query if token is available
        queryFn: async () => {
            const res = await axios.get('http://localhost:6001/users', {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 403) {
                throw new Error('Forbidden: Invalid or expired token');
            }

            return res.data;
        },
    });

    return { users, refetch, isUserLoading };
};

export default useUsers;

