import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HotelsPage = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/hotels")
            .then((response) => response.json())
            .then((data) => setHotels(data))
            .catch((error) => console.error("Error fetching hotels:", error));
    }, []);

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="/">Hotel Management System</a>
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

            {/* Hotels Section */}
            <div className="container mt-4">
                <h2 className="text-center mb-4">Available Hotels</h2>
                <div className="row">
                    {hotels.map((hotel) => (
                        <div key={hotel.id} className="col-md-4 mb-4">
                            <div className="card shadow-sm">
                                {/* <img 
                                    src={`https://source.unsplash.com/400x250/?hotel,${hotel.location}`} 
                                    className="card-img-top" 
                                    alt={hotel.name} 
                                /> */}
                                <div className="card-body">
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <p className="card-text"><strong>Location:</strong> {hotel.location}</p>
                                    <p className="card-text"><strong>Price:</strong> ${hotel.price} per night</p>
                                    <Link to={`/hotel/${hotel.id}`} className="btn btn-primary w-100">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelsPage;


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const HotelsPage = () => {
//     const [hotels, setHotels] = useState([]);

//     useEffect(() => {
//         fetch("http://localhost:5000/hotels")
//             .then((response) => response.json())
//             .then((data) => setHotels(data))
//             .catch((error) => console.error("Error fetching hotels:", error));
//     }, []);

//     return (
//         <div className="container">
//             <h2>Available Hotels</h2>
//             <div className="hotels-list">
//                 {hotels.map((hotel) => (
//                     <div key={hotel.id} className="hotel-card">
//                         <h3>{hotel.name}</h3>
//                         <p>Location: {hotel.location}</p>
//                         <p>Price: ${hotel.price} per night</p>
//                         <Link to={`/hotel/${hotel.id}`} className="btn btn-primary">View Details</Link>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default HotelsPage;

