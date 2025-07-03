import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import Lottie from 'lottie-react';
import Loader from '../Components/Loaders/hotel.json';
import Error from '../Components/Loaders/Error.json';
import './HotelDetails.css';

const HotelDetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://travelnest-3.onrender.com/api/hotels/id/${_id}`);
        if (!response.ok) throw new Error('Hotel not found');
        const data = await response.json();
        setHotel(data);
      } catch (err) {
        console.error('Error fetching hotel details:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [_id]);

  const handleBookNow = () => {
    navigate(`/booking/${_id}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="hotel-loader-container">
          <Lottie
            animationData={Loader}
            loop
            autoplay
            style={{ width: 300, height: 300 }}
          />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="hotel-error-container">
          <div className="hotel-error-message">
            <p>Failed to load hotel details.</p>
            {/* <p> {error}</p> */}
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
          <Lottie
            animationData={Error}
            loop
            autoplay
            style={{ width: 200, height: 200 }}
          />
        </div>
        <Footer />
      </>
    );
  }

  if (!hotel) {
    return (
      <>
        <Header />
        <div className="hotel-error-container">
          <p>Hotel not found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="hotel-details-container">
        <h1>{hotel.name}</h1>
        <img src={hotel.images?.[0]} alt={hotel.name} />
        <p><strong>Location:</strong> {hotel.city}</p>
        <p><strong>Rating:</strong> {hotel.rating} ★</p>
        <p><strong>Price per night:</strong> ₹{hotel.price}</p>
        <p><strong>Amenities:</strong> {hotel.amenities?.join(', ')}</p>
        <p><strong>Description:</strong> {hotel.description}</p>
        <button onClick={handleBookNow}>Book Now</button>
      </div>
      <Footer />
    </>
  );
};

export default HotelDetails;
