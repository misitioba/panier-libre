module.exports = app => {
    return async function getOrder(id) {
        return await app.dbExecute(
            `
            SELECT 
            orderItem.*, client.email, client.is_subscriber 
            FROM orders as orderItem
                LEFT JOIN clients as client on client.id = orderItem.client_id
            WHERE orderItem.id = ?`, [id], {
                dbName: this.dbName,
                single: true
            }
        )
    }
}