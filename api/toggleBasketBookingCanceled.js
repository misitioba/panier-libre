module.exports = app => {
    return async function toggleBasketBookingCanceled(
        basket_booking_id,
        is_canceled
    ) {
        return await app.dbExecute(
            'UPDATE basket_bookings SET is_canceled = ? WHERE id = ?', [is_canceled, basket_booking_id], {
                dbName: this.dbName
            }
        )
    }
}