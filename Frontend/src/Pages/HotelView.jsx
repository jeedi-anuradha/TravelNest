import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./HotelView.css";
import { toast } from "react-toastify";
import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";
import { useSearch } from "../Context/SearchContext";
import { useWishlist } from "../Context/WishListContext";

const HotelView = () => {
  const { type } = useParams();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {addToWishlist, removeFromWishlist, isInWishlist}=useWishlist()
  const hotelsPerPage = 6;
  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:3001/");
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

  // Search functionality
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

  const nextImage = (hotelId) => {
    setFilteredHotels(
      filteredHotels.map((hotel) => {
        if (hotel.id === hotelId) {
          const nextIndex = (hotel.currentImageIndex || 0) + 1;
          return {
            ...hotel,
            currentImageIndex: nextIndex >= hotel.images.length ? 0 : nextIndex,
          };
        }
        return hotel;
      })
    );
  };

  const prevImage = (hotelId) => {
    setFilteredHotels(
      filteredHotels.map((hotel) => {
        if (hotel.id === hotelId) {
          const prevIndex = (hotel.currentImageIndex || 0) - 1;
          return {
            ...hotel,
            currentImageIndex:
              prevIndex < 0 ? hotel.images.length - 1 : prevIndex,
          };
        }
        return hotel;
      })
    );
  };

  // Pagination Logic
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading hotels...</p>;
  if (error) return <p>Error: {error}</p>;

  // WishList
  const toggleWishlist=(hotel)=>{
    if(isInWishlist(hotel.id)){
      removeFromWishlist(hotel.id)
      toast.success(`${hotel.name} removed from wishlist`,{
        position:'top-right',
        autoClose:1000
      })
    }
    else{
      addToWishlist(hotel)
      toast.success(`${hotel.name} added to wishlist`,{
        position:"top-right",
        autoClose:1000
      })
    }
  }

  return (
    <>
      <Header />
      <div className="popular-heading" style={{ padding: '20px' }}>
        <h1>Hotels for: {type.replace(/-/g, " ")}</h1>

        {searchQuery && (
          <p>Showing {filteredHotels.length} results for "{searchQuery}"</p>
        )}

        <div className="popular-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {currentHotels.length > 0 ? (
            currentHotels.map((hotel) => (
              <div className="popular-hotels" key={hotel._id || hotel.name}>
                <div className="image-gallery">
                  <img
                    src={hotel.images[hotel.currentImageIndex || 0] || 'https://via.placeholder.com/300x200'}
                    alt={`${hotel.name} image`}
                  />
                  <button
                    className="nav-arrow left-arrow"
                    onClick={() => prevImage(hotel.id)}
                  >
                    &lt;
                  </button>
                  <button
                    className="nav-arrow right-arrow"
                    onClick={() => nextImage(hotel.id)}
                  >
                    &gt;
                  </button>
                </div>
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

export default HotelView;