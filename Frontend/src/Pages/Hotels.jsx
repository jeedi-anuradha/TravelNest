import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import { useSearch } from '../Context/SearchContext';
import { useWishlist } from '../Context/WishListContext';

const Hotels = () => {
  const { cityName } = useParams();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useSearch();
  const {addToWishlist, removeFromWishlist, isInWishlist}=useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const HotelsPerPage = 6;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://localhost:3001/');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        const hotelCity = data.filter(hotel => 
          hotel.city.toLowerCase() === cityName.toLowerCase()
        );
        setHotels(hotelCity);
        setFilteredHotels(hotelCity);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [cityName]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(lowerCaseQuery) ||
      hotel.city.toLowerCase().includes(lowerCaseQuery) 
      // (hotel.description && hotel.description.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredHotels(results);
    setCurrentPage(1);
  }, [searchQuery, hotels]);

  if (loading) return <p>Loading Hotels for {cityName}...</p>;
  if (error) return <p>Error: {error}</p>;

  // Pagination
  const indexOfLast = currentPage * HotelsPerPage;
  const indexOfFirst = indexOfLast - HotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredHotels.length / HotelsPerPage);

  const handleChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Wishlist
  const toggleWishlist=(hotel)=>{
        if (isInWishlist(hotel.id)){
          removeFromWishlist(hotel.id)
          toast.success(`${hotel.name} removed from wishlist`, {
            position: "top-right",
            autoClose: 1000,
          });
        }
        else{
          addToWishlist(hotel)
          toast.success(`${hotel.name} added to wishlist`, {
            position: "top-right",
            autoClose: 1000,
          });
        }
      }

  return (
    <>
      <Header/>
      <div className="popular-heading" style={{ padding: '20px' }}>
        <h1>Featured Hotels in {cityName.charAt(0).toUpperCase() + cityName.slice(1)}</h1>
        
        {searchQuery && (
          <p>Showing {filteredHotels.length} results for "{searchQuery}"</p>
        )}

        <div className="popular-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {currentHotels.length > 0 ? (
            currentHotels.map((hotel) => (
              <div key={hotel.id} className="popular-hotels">
                <img src={hotel.images[0]} alt={hotel.name} />
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

        {filteredHotels.length > HotelsPerPage && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handleChange(index + 1)}
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
      <Footer/>
    </>
  );
};

export default Hotels;