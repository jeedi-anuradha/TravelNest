import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./Components/Landing/LandingPage";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Hotels from "./Pages/Hotels";
import HotelView from "./Pages/HotelView";
import PopularHotels from "./Pages/PopularHotels";
import { SearchProvider } from "./Context/SearchContext";
import { WishlistProvider } from "./Context/WishListContext";
import { AuthProvider } from "./Context/AuthContext";
import { useAuth } from "./Context/AuthContext";
import Wishlist from "./Pages/Wishlist";
import HotelDetails from "./Pages/HotelDetails";
import BookingPage from "./Pages/Booking/BookingPage";
import MyBookings from "./Components/MyBookings/MyBookings";


// const WishlistProviderWithUser = ({ children }) => {
//   const { user } = useAuth();
//   return <WishlistProvider userId={user?.id}>{children}</WishlistProvider>;
// };

const App = () => {
  return (
    <>
      
      <AuthProvider>
      <SearchProvider>
        <WishlistProvider>
          <ToastContainer />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path='/my-bookings' element={<MyBookings/>}/>
                <Route path="/popular" element={<PopularHotels />} />
                <Route path="/city/:cityName" element={<Hotels />} />
                <Route path="/hotel/:type" element={<HotelView />} />
                <Route path="/wishlist" element={<Wishlist/>}/>
                <Route path="/hotel-details/:_id" element={<HotelDetails/>} />
                <Route path="/booking/:_id" element={<BookingPage/>} />

              </Routes>
            </BrowserRouter>
        </WishlistProvider>
      </SearchProvider>
      </AuthProvider>
    </>
  );
};

export default App;
