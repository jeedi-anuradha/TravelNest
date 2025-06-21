import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]); // Initialize as empty array
  const { user } = useAuth();

  // Fetch wishlist from backend when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:3001/wishlist/${user._id || user.id}`);
          if (!response.ok) throw new Error('Failed to fetch wishlist');
          
          const data = await response.json();
          // Ensure data is always an array
          const normalizedWishlist = Array.isArray(data) ? data : [];
          setWishlist(normalizedWishlist);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          setWishlist([]); // Reset to empty array on error
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (hotel) => {
    if (!user) {
      return { success: false, requiresLogin: true };
    }
    
    try {
      const response = await fetch('http://localhost:3001/wishlist/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id || user._id,
          hotel: {
            ...hotel,
            id: hotel.id || String(new Date().getTime()) // Fallback ID if missing
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        // Ensure we're adding a properly formatted hotel object
        const newHotel = result.hotel || result;
        if (newHotel && newHotel.id) {
          setWishlist(prev => [...prev, newHotel]);
        }
        return { success: true };
      }
      throw new Error('Failed to add to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFromWishlist = async (hotelId) => {
    if (!user) return;
    
    try {
      const response = await fetch(
        `http://localhost:3001/wishlist/${user._id || user.id}/${hotelId}`, 
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        setWishlist(prev => 
          Array.isArray(prev) 
            ? prev.filter(item => item && item.id !== hotelId) 
            : []
        );
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (hotelId) => {
    // Double check that wishlist is an array and items have ids
    return Array.isArray(wishlist) && 
           wishlist.some(item => item && item.id === hotelId);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist: Array.isArray(wishlist) ? wishlist : [], // Ensure array
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);