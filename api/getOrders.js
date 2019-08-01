module.exports = app => {
    return async function getDashboardData() {
        let query = `
        SELECT orderItem.id as orderId, orderItem.*, c.email
        FROM orders as orderItem
        JOIN clients as c on c.id = orderItem.client_id
        `
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}