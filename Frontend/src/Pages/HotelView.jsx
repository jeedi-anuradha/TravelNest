import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import './HotelView.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearch } from '../Context/SearchContext';
import { useWishlist } from '../Context/WishlistContext';
import HotelInfoModal from './HotelInfoModal';
import Lottie from 'lottie-react';
import Loader from '../Components/Loaders/hotel.json';
import Error from '../Components/Loaders/Error.json';

const HotelView = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useSearch();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const hotelsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://travelnest-3.onrender.com/api/hotels");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        const filtered = data.filter((hotel) => {
          const hotelViews = Array.isArray(hotel.view)
            ? hotel.view
            : [hotel.view];
          return hotelViews.some(
            (view) =>
              view.toLowerCase() === type.replace(/-/g, " ").toLowerCase()
          );
        });

        setHotels(filtered.length ? filtered : data);
        setFilteredHotels(filtered.length ? filtered : data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lowerCaseQuery) ||
        hotel.city.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredHotels(results);
    setCurrentPage(1);
  }, [searchQuery, hotels]);

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleWishlist = (hotel, e) => {
    e.stopPropagation();
    if (isInWishlist(hotel.id)) {
      removeFromWishlist(hotel.id);
      toast.success(`${hotel.name} removed from wishlist`, {
        position: 'top-right',
        autoClose: 1000
      });
    } else {
      addToWishlist(hotel);
      toast.success(`${hotel.name} added to wishlist`, {
        position: "top-right",
        autoClose: 1000
      });
    }
  };

  const handleBookNow = (hotel, e) => {
    e.stopPropagation();
    setSelectedHotel(hotel);
    setShowModal(true);
  }

  const handleReadyToBook = (hotel) => {
    setShowModal(false);
    navigate(`/booking/${hotel._id}`);
  }

  return (
    <>
      <Header />

      {loading ? (
        <div className="popular-loader-container">
          <Lottie
            animationData={Loader}
            loop
            autoplay
            style={{ width: 300, height: 300 }}
          />
        </div>
      ) : error ? (
        <div className="popular-error-container">
          <div className="popular-error-message">
            <p>Failed to fetch hotels for {type.replace(/-/g, " ")}</p>
          </div>
          <div className="popular-error-loader">
            <Lottie
              animationData={Error}
              loop
              autoplay
              style={{ width: 200, height: 200 }}
            />
          </div>
        </div>
      ) : (
        <div className="popular-heading" style={{ padding: '20px' }}>
          <h1>Hotels for: {type.replace(/-/g, " ")}</h1>

          {searchQuery && (
            <p>Showing {filteredHotels.length} results for "{searchQuery}"</p>
          )}

          <div className="popular-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {currentHotels.length > 0 ? (
              currentHotels.map((hotel) => (
                <div
                  className="popular-hotels"
                  key={hotel._id || hotel.name}
                  onClick={() => navigate(`/hotel-details/${hotel._id}`)}
                >
                  <img
                    src={hotel.images?.[0] || 'https://via.placeholder.com/300x200'}
                    alt={`${hotel.name} image`}
                  />
                  <p>Rating: {hotel.rating}</p>
                  <h4>{hotel.name}</h4>
                  <p>Place: {hotel.city}</p>
                  <p>Price per Night: ₹{hotel.price}</p>
                  <p>
                    View:{" "}
                    {Array.isArray(hotel.view)
                      ? hotel.view.join(", ")
                      : hotel.view}
                  </p>
                  <button onClick={(e) => handleBookNow(hotel, e)}>Book Now</button>
                  <p
                    className='wishlist-heart'
                    style={{ color: isInWishlist(hotel.id) ? "red" : "black" }}
                    onClick={(e) => toggleWishlist(hotel, e)}
                  >
                    ❤︎
                  </p>
                </div>
              ))
            ) : (
              <p>No hotels found matching your search.</p>
            )}
          </div>

          {filteredHotels.length > hotelsPerPage && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    padding: "8px 12px",
                    margin: "0 5px",
                    backgroundColor: currentPage === index + 1 ? "#003664" : "grey",
                    color: currentPage === index + 1 ? "white" : "black",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && selectedHotel && (
        <HotelInfoModal
          hotel={selectedHotel}
          onClose={() => setShowModal(false)}
          onBookNow={handleReadyToBook}
        />
      )}

      <Footer />
    </>
  );
};

export default HotelView;
