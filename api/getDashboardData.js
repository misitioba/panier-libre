module.exports = app => {
    return async function getDashboardData() {
        let query = `
        SELECT bb.id, c.email, bb.quantity,b.id as basket_id, bb.date as booking_date, b.delivery_date, bb.is_canceled
        FROM baskets as b
        JOIN basket_bookings as bb on bb.basket_id = b.id
        JOIN clients as c on c.id = bb.client_id
        
        `
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}