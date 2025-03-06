import React from "react";
import { Routes, Route } from "react-router-dom";
import HotelsPage from "./components/HotelsPage";
import HotelDetailsPage from "./components/HotelDetailsPage";
import BookingPage from "./components/BookingPage";
import MyBookingsPage from "./components/MyBookingsPage";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/js/bootstrap.bundle.min";


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<HotelsPage />} />
            <Route path="/hotel/:id" element={<HotelDetailsPage />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
        </Routes>
    );
};

export default App;
