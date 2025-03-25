import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HotelDetailsPage = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);

    useEffect(() => {
        //fetch(`http://localhost:5000/hotels/${id}`)
        fetch(`https://hotel-management-system-es78.onrender.com/hotels/${id}`)
            .then((response) => response.json())
            .then((data) => setHotel(data))
            .catch((error) => console.error("Error fetching hotel details:", error));
    }, [id]);

    if (!hotel) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="/">Hotel Booking</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Hotels</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/bookings">My Bookings</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                {/* Title Section */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold">{hotel.name}</h2>
                    <span className="badge bg-secondary">{hotel.location}</span>
                </div>

                <div className="row">
                    {/* Hotel Details Card */}
                    <div className="col-md-8">
                        <div className="card shadow p-4">
                            <h4 className="fw-bold">Hotel Information</h4>
                            <p><strong>Location:</strong> {hotel.location}</p>
                            <p><strong>Price:</strong> <span className="badge bg-success">${hotel.price} per night</span></p>
                            
                            {/* <p><strong>Cancellation Policy:</strong> {hotel.cancellationPolicy.penalty}</p> */}
                            {/* Cancellation Policy Section */}
                            <div className="alert alert-info">
                                <h5>Cancellation Policy</h5>
                                <p><strong>Penalty:</strong> {hotel.cancellation_policy.penalty}</p>
                                <p><strong>Free Cancellation Before:</strong> {hotel.cancellation_policy.freeBeforeDays} days</p>
                            </div>

                        </div>
                    </div>

                    {/* Hotel Highlights */}
                    <div className="col-md-4">
                        <div className="card shadow p-4">
                            <h5 className="fw-bold">Hotel Highlights</h5>
                            <ul className="list-unstyled">
                                <li>⭐ {crypto.getRandomValues(new Uint32Array(1))[0] % 3 + 3}-Star Rating</li>
                                <li>📶 Free WiFi</li>
                                <li>🏊‍♂️ Swimming Pool</li>
                                <li>💪 Fitness Center</li>
                                <li>🍽️ In-House Restaurant</li>
                                <li>🏙️ Near Popular Attractions</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <Link to={`/book/${hotel.id}`} className="btn btn-success me-3">Book Now</Link>
                    <Link to="/" className="btn btn-secondary">Back to Hotels</Link>
                </div>

            </div>
        </div>
    );
};

export default HotelDetailsPage;


// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// const HotelDetailsPage = () => {
//     const { id } = useParams();
//     const [hotel, setHotel] = useState(null);

//     useEffect(() => {
//         fetch(`http://localhost:5000/hotels/${id}`)
//             .then((response) => response.json())
//             .then((data) => setHotel(data))
//             .catch((error) => console.error("Error fetching hotel details:", error));
//     }, [id]);

//     if (!hotel) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div className="container">
//             <h2>{hotel.name}</h2>
//             <p>Location: {hotel.location}</p>
//             <p>Price: ${hotel.price} per night</p>
//             <p>Cancellation Policy: {hotel.cancellationPolicy.penalty}</p>
//             <Link to={`/book/${hotel.id}`} className="btn btn-success">Book Now</Link>
//             <Link to="/" className="btn btn-secondary">Back to Hotels</Link>
//         </div>
//     );
// };

// export default HotelDetailsPage;
