import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import '../Styles/BookingPage.css';

const BookingPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalPrice: 0
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/hotel/${_id}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch hotel data');
        }
        
        const data = await res.json();
        setHotel(data);
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [_id]);

  useEffect(() => {
    if (hotel && bookingDetails.checkIn && bookingDetails.checkOut) {
      const checkInDate = new Date(bookingDetails.checkIn);
      const checkOutDate = new Date(bookingDetails.checkOut);
      
      if (checkOutDate <= checkInDate) {
        setBookingDetails(prev => ({ ...prev, totalPrice: 0 }));
        return;
      }
      
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      setBookingDetails(prev => ({
        ...prev,
        totalPrice: nights * hotel.price * bookingDetails.guests
      }));
    }
  }, [bookingDetails.checkIn, bookingDetails.checkOut, bookingDetails.guests, hotel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
      alert('Please select both check-in and check-out dates');
      return;
    }
    
    const checkInDate = new Date(bookingDetails.checkIn);
    const checkOutDate = new Date(bookingDetails.checkOut);
    
    if (checkOutDate <= checkInDate) {
      alert('Check-out date must be after check-in date');
      return;
    }

    navigate('/booking-confirmation', { 
      state: { 
        hotel,
        bookingDetails 
      } 
    });
  };

  if (loading) return (
    <div className="loading-container">
      <Header />
      <p>Loading hotel details...</p>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="error-container">
      <Header />
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
      <Footer />
    </div>
  );

  if (!hotel) return (
    <div className="error-container">
      <Header />
      <p>Hotel not found</p>
      <Footer />
    </div>
  );

  return (
    <>
      <Header />
      <div className="booking-container">
        <h1>Book Your Stay at {hotel.name}</h1>
        
        <div className="booking-content">
          <div className="hotel-info">
            <img 
              src={hotel.images?.[0] || 'https://via.placeholder.com/500x300'} 
              alt={hotel.name} 
              className="hotel-image"
            />
            <div className="hotel-details">
              <p><strong>Location:</strong> {hotel.city}</p>
              <p><strong>Rating:</strong> {hotel.rating} ★</p>
              <p><strong>Price per night:</strong> ₹{hotel.price}</p>
              <p><strong>Amenities:</strong> {hotel.amenities?.join(', ')}</p>
            </div>
          </div>
          
          <form className="booking-form" onSubmit={handleSubmit}>
            <h2>Booking Details</h2>
            
            <div className="form-group">
              <label htmlFor="checkIn">Check-in Date:</label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={bookingDetails.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="checkOut">Check-out Date:</label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={bookingDetails.checkOut}
                onChange={handleInputChange}
                min={bookingDetails.checkIn || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="guests">Number of Guests:</label>
              <select
                id="guests"
                name="guests"
                value={bookingDetails.guests}
                onChange={handleInputChange}
                required
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            {bookingDetails.totalPrice > 0 && (
  <div className="price-summary">
    <h3>Price Summary</h3>
    <p>Total for your stay: ₹{bookingDetails.totalPrice}</p>
    <p>
      {Math.ceil(
        (new Date(bookingDetails.checkOut) - new Date(bookingDetails.checkIn)) / 
        (1000 * 60 * 60 * 24)
      )} nights
    </p>
  </div>
)}
            <button type="submit" className="confirm-booking">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;