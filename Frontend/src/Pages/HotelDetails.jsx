import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import './HotelDetails.css'

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
        const response = await fetch(`http://localhost:3001/id/${_id}`);
        if (!response.ok) throw new Error('Hotel not found');
        const data = await response.json();
        console.log("Received data",data)
        setHotel(data);
      } catch (err) {
        console.log('error fetching data',err.message)
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [_id]);

  const handleBookNow = () => {
    navigate(`/booking/${_id}`); // Navigate to booking page with hotel ID
  };


  if (loading) return <div>Loading hotel details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <>
      <Header />
      <div className="hotel-details-container">
        <h1>{hotel.name}</h1>
        <img src={hotel.images?.[0]} alt={hotel.name} />
        <p>Location: {hotel.city}</p>
        <p>Rating: {hotel.rating}</p>
        <p>Price per night: ₹{hotel.price}</p>
        <p>Amenities: {hotel.amenities?.join(', ')}</p>
        <p>Description: {hotel.description}</p>
        <button onClick={handleBookNow}>Book Now</button>
      </div>
      <Footer />
    </>
  );
};

export default HotelDetails;