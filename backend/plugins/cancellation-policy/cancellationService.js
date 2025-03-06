module.exports = {
    checkCancellation: (booking, hotel) => {
        const currentDate = new Date();
        const checkInDate = new Date(booking.checkIn);
        const daysBeforeCheckIn = Math.ceil((checkInDate - currentDate) / (1000 * 60 * 60 * 24));

        if (daysBeforeCheckIn >= hotel.cancellationPolicy.freeBeforeDays) {
            return { allowed: true, message: "Cancellation is free" };
        } else {
            return { 
                allowed: false, 
                message: `Cancellation not allowed. Penalty: ${hotel.cancellationPolicy.penalty}` 
            };
        }
    }
};
