import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customer: "",
        checkIn: "",
        checkOut: "",
        email: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // fetch("http://localhost:5000/bookings", {
        fetch("https://hotel-management-system-es78.onrender.com/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hotel_id: id, ...formData }),
        })
            .then((response) => response.json())
            .then((data) => {
                // alert("Booking successful!");
                alert(data.message)
                navigate("/");
            })
            .catch((error) => console.error("Error booking hotel:", error));
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
                                <Link className="nav-link" to="/bookings">My Bookings</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Booking Form Section */}
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
                    <h3 className="text-center mb-3">Book Your Stay</h3>
                    <form onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="yourName">Your Name</label>
                            <input 
                                type="text" 
                                name="customer" 
                                className="form-control" 
                                id="yourName"
                                placeholder="Enter your name" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Email Input */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="emailField">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                className="form-control" 
                                id="emailField"
                                placeholder="Enter your email" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Check-in Date */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="checkinDate">Check-in Date</label>
                            <input 
                                type="date" 
                                name="checkIn" 
                                className="form-control" 
                                id="checkinDate"
                                min={new Date().toISOString().split("T")[0]} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Check-out Date */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="checkoutDate">Check-out Date</label>
                            <input 
                                type="date" 
                                name="checkOut" 
                                className="form-control"
                                id="checkoutDate" 
                                min={formData.checkIn || new Date().toISOString().split("T")[0]} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-success w-100">Confirm Booking</button>
                    </form>

                    {/* Back Button */}
                    <div className="text-center mt-3">
                        <button className="btn btn-secondary" onClick={() => navigate("/")}>
                            Back to Hotels
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;


// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const BookingPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         customer: "",
//         checkIn: "",
//         checkOut: "",
//         email: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         fetch("http://localhost:5000/bookings", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ hotelId: id, ...formData }),
//         })
//             .then((response) => response.json())
//             .then(() => {
//                 alert("Booking successful!");
//                 navigate("/");
//             })
//             .catch((error) => console.error("Error booking hotel:", error));
//     };

//     return (
//         <div className="container">
//             <h2>Book Your Stay</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="customer" placeholder="Your Name" onChange={handleChange} required />
//                 <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//                 <input type="date" name="checkIn" onChange={handleChange} required />
//                 <input type="date" name="checkOut" onChange={handleChange} required />
//                 <button type="submit" className="btn btn-success">Confirm Booking</button>
//             </form>
//         </div>
//     );
// };

// export default BookingPage;
