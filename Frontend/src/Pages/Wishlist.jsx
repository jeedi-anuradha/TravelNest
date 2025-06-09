// pages/Wishlist/Wishlist.js
import React, { useEffect } from 'react';
import { useWishlist } from '../Context/WishlistContext'
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
                src={hotel.images[0]} 
                alt={hotel.name} 
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              />
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p>{hotel.city}</p>
                <p>Rating: {hotel.rating}</p>
                <p>Price: ${hotel.price} per night</p>
                <button 
                  onClick={() => removeFromWishlist(hotel.id)}
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