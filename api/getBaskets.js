module.exports = app => {
    return async function getBaskets() {
        let query = `SELECT 
        b.*, 
        count(
            bb.client_id) as bookings,
        b.quantity-count(
            bb.client_id) as available
        FROM baskets as b 
            LEFT JOIN basket_bookings as bb on bb.basket_id = b.id and bb.is_canceled = 0
        GROUP BY b.id
        `
            // let query = `SELECT * FROM baskets`
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}