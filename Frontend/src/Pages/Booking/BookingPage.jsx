import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { useAuth } from '../../Context/AuthContext';
import '../Styles/BookingPage.css';

const BookingPage = () => {
  const { user } = useAuth();
  const { _id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Fix: useLocation for redirect state

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalPrice: 0
  });

  // Restore state if redirected from login
  useEffect(() => {
    if (!hotel && location.state?.hotel) {
      setHotel(location.state.hotel);
    }

    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
    }
  }, [location.state]);

  // Fetch hotel if not restored from state
  useEffect(() => {
    if (hotel) {
      setLoading(false);
      return;
    }

    const fetchHotel = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/id/${_id}`);
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
  }, [_id, hotel]);

  // Recalculate price
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    alert('You need to login to confirm a booking');
    navigate('/login', {
      state: {
        from: `/booking/${_id}`,
        hotel,
        bookingDetails
      }
    });
    return;
  }

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

  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3001/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // no Authorization header since authMiddleware is removed
  },
  body: JSON.stringify({
    user: user._id, // ✅ ensure this is sent
    hotel,
    checkIn: bookingDetails.checkIn,
    checkOut: bookingDetails.checkOut,
    guests: bookingDetails.guests,
    totalPrice: bookingDetails.totalPrice
  })
});

    const data = await response.json();

    if (response.ok) {
  // Reset the form fields after successful booking
  setBookingDetails({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalPrice: 0
  });

  navigate('/my-bookings', {
    state: {
      hotel,
      bookingDetails,
      booking: data.booking
    }
  });
    } else {
      alert(data.message || 'Failed to confirm booking');
    }
  } catch (error) {
    console.error('Booking submission error:', error);
    alert('An error occurred while confirming your booking.');
  }
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
