module.exports = app => {
    return async function getDashboardData() {
        let query = `
SELECT 
    orderItem.id, b.is_archived, c.fullname, c.email, orderItem.quantity,b.id as basket_id, o.creation_date as booking_date
    #, b.delivery_date
    , orderItem.is_canceled, o.observation as observation, o.id as orderId
FROM baskets as b
    JOIN order_items as orderItem on orderItem.basket_id = b.id
    JOIN orders as o on o.id = orderItem.order_id
    JOIN clients as c on c.id = o.client_id
WHERE orderItem.is_canceled = 0
ORDER BY o.creation_date DESC
        `
        return await app.dbExecute(query, [], {
            dbName: this.dbName
        })
    }
}