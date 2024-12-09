import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthProvider';

const useCart = () => {
    const { user } = useContext(AuthContext);
    const [token, setToken] = useState(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
      const storedToken = localStorage.getItem('access-token');
      if (storedToken) {
        setToken(storedToken);
      }
    }, [user]);
  
    const { refetch, data: cart = [] } = useQuery({
      queryKey: ['carts', user?.email],
      enabled: !!user?.email && !!token,
      refetchInterval: 10000,  // Poll every 10 seconds
      queryFn: async () => {
        const res = await fetch(`${BASE_URL}/carts?email=${user.email}`, {
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
    

    
  
    return [cart, refetch];
  };
  
  export default useCart;