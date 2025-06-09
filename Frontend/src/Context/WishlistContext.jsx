// context/WishlistContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // Fetch wishlist from backend when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          console.log("user",user)
           const response = await fetch(`http://localhost:3001/wishlist/${user._id || user.id}`);
          const data = await response.json();
          setWishlist(data);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
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
          hotel: hotel
        })
      });
      
      if (response.ok) {
        const newItem = await response.json();
        setWishlist(prev => [...prev, newItem.hotel]);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (hotelId) => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3001/wishlist/${user._id || user.id}/${hotelId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.id !== hotelId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (hotelId) => {
    return wishlist.some(item => item.id === hotelId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);