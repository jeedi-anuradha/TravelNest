import React from 'react';
import './Styles/HotelInfoModal.css'

const HotelInfoModal = ({ hotel, onClose, onBookNow }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{hotel.name}</h2>
        <img 
          src={hotel.images?.[0] || 'https://via.placeholder.com/500x300'} 
          alt={hotel.name} 
          className="modal-image"
        />
        <div className="hotel-details">
          <p><strong>Location:</strong> {hotel.city}</p>
          <p><strong>Rating:</strong> {hotel.rating} ★</p>
          <p><strong>Price per night:</strong> ₹{hotel.price}</p>
          <p><strong>Description:</strong> {hotel.description || 'Luxurious 5-star accommodation with premium amenities.'}</p>
        </div>
        <button 
          className="book-now-button"
          onClick={() => onBookNow(hotel)}
        >
          Ready to Book
        </button>
      </div>
    </div>
  );
};

export default HotelInfoModal;