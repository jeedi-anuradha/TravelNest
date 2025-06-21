import React, { useEffect } from 'react';
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleRemove = async (hotel) => {
    try {
      await removeFromWishlist(hotel.id);
      toast.success(`${hotel.name} removed from wishlist`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(`Failed to remove ${hotel.name} from wishlist`, {
        position: "top-right",
        autoClose: 2000,
      });
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.map((hotel) => (
            <div key={hotel.id} className="wishlist-item">
              <img 
                src={hotel.images?.[0] || 'https://via.placeholder.com/300x200'} 
                alt={hotel.name} 
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              />
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p>{hotel.city}</p>
                <p>Rating: {hotel.rating || 'Not rated'}</p>
                <p>Price: ${hotel.price?.toLocaleString() || '0'} per night</p>
                <button 
                  onClick={() => handleRemove(hotel)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;