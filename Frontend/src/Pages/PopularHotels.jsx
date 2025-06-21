import React, { useEffect, useState } from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import './PopularHotels.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearch } from '../Context/SearchContext';
import { useWishlist } from '../Context/WishListContext';


const PopularHotels = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useSearch();
  const {addToWishlist, removeFromWishlist, isInWishlist}=useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:3001/');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        const filteredHotel = data.filter((hotel) => hotel.type === '5-star');
        setPopularHotels(filteredHotel);
        setFilteredHotels(filteredHotel);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, []);

  //search functionality
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = popularHotels.filter(hotel =>
      hotel.name.toLowerCase().includes(lowerCaseQuery) ||
      hotel.city.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredHotels(results);
    setCurrentPage(1);
  }, [searchQuery, popularHotels]);

  // Pagination logic
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading Popular Hotels...</p>;
  if (error) return <p>Error: {error}</p>;

  // Whishlist
  const toggleWishlist = async (hotel) => {
  if (isInWishlist(hotel.id)) {
    await removeFromWishlist(hotel.id);
  } else {
    await addToWishlist(hotel);
  }
};

  return (
    <>
      <Header />
      <div className="popular-heading" style={{ padding: '20px' }}>
        <h1>Popular 5-Star Hotels</h1>
        
        {searchQuery && (
          <p>Showing {filteredHotels.length} results for "{searchQuery}"</p>
        )}

        <div className="popular-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {currentHotels.length > 0 ? (
            currentHotels.map((hotel) => (
              <div className="popular-hotels" key={hotel._id || hotel.name}>
                <img
                  src={hotel.images?.[0] || 'https://via.placeholder.com/300x200'}
                  alt={`${hotel.name} image`}
                />
                <p>Rating: {hotel.rating}</p>
                <h4>{hotel.name}</h4>
                <p>Place: {hotel.city}</p>
                <p>Price per Night: ₹{hotel.price}</p>
                <button>Book Now</button>
                <p className='wishlist-heart'
        style={{color:isInWishlist(hotel.id) ? "red" : "black"}}
        onClick={()=>toggleWishlist(hotel)}
        >❤︎</p>
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
      <Footer />
    </>
  );
};

export default PopularHotels;