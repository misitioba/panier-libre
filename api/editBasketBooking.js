module.exports = app => {
    return async function editBasketBooking(data) {
        let query = `UPDATE order_items SET ${data.field} = ? WHERE id = ?`
        return await app.dbExecute(query, [data.value, data.id], {
            dbName: this.dbName
        })
    }
}