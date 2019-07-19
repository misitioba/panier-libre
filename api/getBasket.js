module.exports = app => {
    return async function getBasket(id) {
        let basket = await app.dbExecute('SELECT * FROM baskets WHERE id = ?', [id], {
            dbName: this.dbName,
            single: true
        })
        let bookings = await app.dbExecute(`SELECT bb.*, c.email FROM basket_bookings as bb
        INNER JOIN clients as c on c.id = bb.client_id
        WHERE basket_id = ? ORDER BY bb.date DESC`, [id], {
            dbName: this.dbName
        })
        basket.bookings = bookings
        return basket
    }
}