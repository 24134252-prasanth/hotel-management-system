const pool = require("../../db"); 

module.exports = {
    checkCancellation: async (booking) => {
        try {
            const currentDate = new Date();
            const checkInDate = new Date(booking.checkin);
            const daysBeforeCheckIn = Math.ceil((checkInDate - currentDate) / (1000 * 60 * 60 * 24));

            const hotelResult = await pool.query(
                "SELECT cancellation_policy FROM hotels WHERE id = $1",
                [booking.hotel_id]
            );

            if (hotelResult.rows.length === 0) {
                return { allowed: false, message: "Hotel not found" };
            }

            let cancellationPolicy = hotelResult.rows[0].cancellation_policy;
            
            if (typeof cancellationPolicy === "string") {
                try {
                    cancellationPolicy = JSON.parse(cancellationPolicy);
                } catch (parseError) {
                    console.error("Error parsing cancellation policy:", parseError);
                    return { allowed: false, message: "Invalid cancellation policy format" };
                }
            }

            if (!cancellationPolicy || typeof cancellationPolicy !== "object") {
                return { allowed: false, message: "Invalid cancellation policy data" };
            }

            const freeBeforeDays = cancellationPolicy.freeBeforeDays;
            const penalty = cancellationPolicy.penalty;

            if (daysBeforeCheckIn >= freeBeforeDays) {
                return { allowed: true, message: "Cancellation is free" };
            } else {
                return { 
                    allowed: false, 
                    message: `Cancellation not allowed. Penalty: ${penalty}` 
                };
            }
        } catch (error) {
            console.error("Error in checkCancellation:", error);
            return { allowed: false, message: "Internal server error" };
        }
    }
};


// CODE FOR LOCAL DB
// -----------------
// module.exports = {
//     checkCancellation: (booking, hotel) => {
//         const currentDate = new Date();
//         const checkInDate = new Date(booking.checkIn);
//         const daysBeforeCheckIn = Math.ceil((checkInDate - currentDate) / (1000 * 60 * 60 * 24));

//         if (daysBeforeCheckIn >= hotel.cancellationPolicy.freeBeforeDays) {
//             return { allowed: true, message: "Cancellation is free" };
//         } else {
//             return { 
//                 allowed: false, 
//                 message: `Cancellation not allowed. Penalty: ${hotel.cancellationPolicy.penalty}` 
//             };
//         }
//     }
// };
