import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // fetch("http://localhost:5000/bookings")
        fetch("https://hotel-management-system-es78.onrender.com/bookings")
            .then((response) => response.json())
            .then((data) => setBookings(data))
            .catch((error) => console.error("Error fetching bookings:", error));
    }, []);

    const handleCancel = (bookingId) => {
        // fetch(`http://localhost:5000/bookings/${bookingId}/cancel`, { method: "DELETE" })
        fetch(`https://hotel-management-system-es78.onrender.com/${bookingId}/cancel`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                console.log("Cancellation API Response:", data);
                if (!data.allowed) {
                    alert(data.message);
                    return;
                }

                alert("Booking canceled successfully.");
                setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
            })
            .catch(error => console.error("Error canceling booking:", error));
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">Hotel Booking</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Hotels</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/bookings">My Bookings</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Bookings List */}
            <div className="container mt-4">
                <h2 className="text-center mb-4">My Bookings</h2>
                <div className="row">
                    {bookings.length === 0 ? (
                        <div className="text-center mt-5">
                            <h4 className="text-muted">You have no bookings yet.</h4>
                            <Link to="/" className="btn btn-primary mt-3">Browse Hotels</Link>
                        </div>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking.id} className="col-md-6 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{booking.hotelName || "Hotel Name Not Available"}</h5>
                                        <p className="card-text"><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                                        <p className="card-text"><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                                        <p className="card-text"><strong>Booked by:</strong> {booking.customer} ({booking.email})</p>
                                        <button onClick={() => handleCancel(booking.id)} className="btn btn-danger w-100">
                                            Cancel Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookingsPage;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const MyBookingsPage = () => {
//     const [bookings, setBookings] = useState([]);

//     useEffect(() => {
//         fetch("http://localhost:5000/bookings")
//             .then((response) => response.json())
//             .then((data) => setBookings(data))
//             .catch((error) => console.error("Error fetching bookings:", error));
//     }, []);

//     // const handleCancel = (bookingId) => {
//     //     fetch(`http://localhost:5000/bookings/${bookingId}`, { method: "DELETE" })
//     //         .then(() => {
//     //             alert("Booking cancelled successfully!");
//     //             setBookings(bookings.filter(booking => booking.id !== bookingId));
//     //         })
//     //         .catch((error) => console.error("Error cancelling booking:", error));
//     // };
//     const handleCancel = (bookingId) => {
//         fetch(`http://localhost:5000/bookings/${bookingId}/cancel`, { method: "DELETE" })
//             .then(response => response.json())
//             .then(data => {
//                 if (!data.allowed) {
//                     alert(data.message); // Show penalty message if cancellation is denied
//                     return;
//                 }
    
//                 alert("Booking canceled successfully.");
//                 setBookings(bookings.filter((booking) => booking.id !== bookingId));
//             })
//             .catch(error => console.error("Error canceling booking:", error));
//     };

//     return (
//         <div>
//             {/* Navbar */}
//             <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//                 <div className="container">
//                     <Link className="navbar-brand" to="/">Hotel Booking</Link>
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarNav">
//                         <ul className="navbar-nav ms-auto">
//                             <li className="nav-item">
//                                 <Link className="nav-link" to="/">Hotels</Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className="nav-link active" to="/bookings">My Bookings</Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </nav>

//             {/* Bookings List */}
//             <div className="container mt-4">
//                 <h2 className="text-center mb-4">My Bookings</h2>
//                 <div className="row">
//                     {bookings.length === 0 ? (
//                         <p className="text-center">No bookings found.</p>
//                     ) : (
//                         bookings.map((booking) => (
//                             <div key={booking.id} className="col-md-6 mb-4">
//                                 <div className="card shadow-sm">
//                                     <div className="card-body">
//                                         <h5 className="card-title">{booking.hotelName}</h5>
//                                         <p className="card-text"><strong>Check-in:</strong> {booking.checkIn}</p>
//                                         <p className="card-text"><strong>Check-out:</strong> {booking.checkOut}</p>
//                                         <p className="card-text"><strong>Booked by:</strong> {booking.customer} ({booking.email})</p>
//                                         <button onClick={() => handleCancel(booking.id)} className="btn btn-danger w-100">
//                                             Cancel Booking
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyBookingsPage;
