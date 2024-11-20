import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthProvider';

const useBookingVenueCart = () => {
    const { user } = useContext(AuthContext);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('access-token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, [user]);

    const { refetch, data: bookingVenueCart = [] } = useQuery({
        queryKey: ['booking-venue-cart', user?.email],
        enabled: !!user?.email && !!token,  // Run query only if user and token exist
        queryFn: async () => {
            const res = await fetch(`http://localhost:6001/booking-venue-cart?email=${user.email}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(`Error ${res.status}: ${errorMessage}`);
            }

            return res.json();
        },
    });

    return [bookingVenueCart, refetch];
};

export default useBookingVenueCart;
