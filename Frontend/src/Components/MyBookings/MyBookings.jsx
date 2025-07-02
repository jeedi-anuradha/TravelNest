import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import './MyBookings.css';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:3001/bookings/${user._id}`);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        console.log("booking",data)
        setBookings(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchBookings();
    }
  }, [user]);


  const handleCancel = async (bookingId) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/bookings/${bookingId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        alert('Booking cancelled successfully');
        // Remove the cancelled booking from UI
        setBookings(prev => prev.filter(b => b._id !== bookingId));
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while cancelling the booking');
    }
  };

const handleImageClick = (hotelId) => {
    navigate(`/hotel-details/${hotelId}`);
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <>
      <Header />
      <div className="my-bookings-container">
        <h2>My Bookings</h2>
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <img src={booking.hotel?.images[0]} alt={booking.hotel?.name} onClick={() => handleImageClick(booking.hotel?._id)}/>
              <h3>{booking.hotel?.name}</h3>
              <p><strong>Location:</strong> {booking.hotel?.city}</p>
              <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
              <button className="cancel-btn" onClick={() => handleCancel(booking._id)}>
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyBookings;
